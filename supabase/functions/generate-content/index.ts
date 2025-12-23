import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

// CORS Headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const {
      action: _action,
      filePath,
      quizId,
      generationParams,
    } = await req.json();
    // Expected Payload:
    // {
    //   action: 'generate_quiz',
    //   filePath: 'uploads/abc.pdf', (path in bucket)
    //   quizId: 'uuid',
    //   generationParams: { difficulty, numberOfQuestions, ... }
    // }

    // Init Supabase Client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!(supabaseUrl && supabaseKey)) {
      throw new Error("Missing Supabase environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Init Gemini
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) {
      throw new Error("GEMINI_API_KEY is missing");
    }
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Helper to send Realtime Progress
    const sendProgress = async (percentage: number, message: string) => {
      // Option A: Update DB (Persistent Log)
      await supabase
        .from("quizzes")
        .update({
          generation_params: {
            ...generationParams,
            progress: percentage,
            step: message,
          },
        })
        .eq("id", quizId);

      // Option B: Realtime Broadcast (Ephemeral - Better for UI bars)
      const channel = supabase.channel(`quiz:${quizId}`);
      await channel.send({
        type: "broadcast",
        event: "progress",
        payload: { progress: percentage, message },
      });
      // cleanup handled by client unsubscription usually, or precise channel management
    };

    // --- STEP 1: DOWNLOAD FILE (10%) ---
    await sendProgress(10, "Fetching file from storage...");

    // Download file from 'uploads' bucket (or whatever bucket name used)
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("uploads") // Adjust bucket name if needed
      .download(filePath);

    if (downloadError) {
      throw new Error(`Download failed: ${downloadError.message}`);
    }

    // Convert Blob to Base64/Bytes for Gemini
    const arrayBuffer = await fileData.arrayBuffer();
    const base64Data = btoa(
      String.fromCharCode(...new Uint8Array(arrayBuffer)),
    );

    // Detect MimeType (simple check)
    const mimeType = fileData.type || "application/pdf"; // Default logic

    // --- STEP 2: GENERATE CONTENT (40%) ---
    await sendProgress(40, "Analyzing content with AI...");

    const prompt = `
      You are an expert educational content generator.
      Task: Create a quiz based on the attached document.

      Settings:
      - Difficulty: ${generationParams?.difficulty || "Medium"}
      - Number of Questions: ${generationParams?.numberOfQuestions || 5}
      - Question Type: ${generationParams?.questionType || "Mixed"}

      Output Format: JSON Array ONLY.
      Schema:
      [
        {
          "question_text": "string",
          "question_type": "multiple_choice" | "true_false" | "fill_in_blank" | "short_answer",
          "options": ["Option A", "Option B", "Option C", "Option D"] (or null if not MCQ),
          "correct_answer": "string" (or index for MCQ like "0"),
          "explanation": "string"
        }
      ]
      IMPORTANT: Return ONLY the JSON array. No markdown code blocks.
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    // --- STEP 3: PARSING & SAVING (80%) ---
    await sendProgress(80, "Saving generated quiz...");

    // Clean up markdown code blocks if present (Gemini sometimes adds ```json ... ```)
    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    interface QuestionData {
      question_text: string;
      question_type?: string;
      options?: string[];
      correct_answer: string;
      explanation?: string;
    }

    let questions: QuestionData[];
    try {
      questions = JSON.parse(cleanedText);
    } catch (_e) {
      throw new Error("Failed to parse AI response as JSON");
    }

    if (!Array.isArray(questions)) {
      throw new Error("AI response is not an array");
    }

    // Insert into DB
    const questionsToInsert = questions.map(
      (
        q: {
          question_text: string;
          question_type?: string;
          options?: string[];
          correct_answer: string;
          explanation?: string;
        },
        index: number,
      ) => ({
        quiz_id: quizId,
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.options ? JSON.stringify(q.options) : null, // Convert array to JSONB
        correct_answer: String(q.correct_answer),
        explanation: q.explanation,
        order_index: index,
      }),
    );

    const { error: insertError } = await supabase
      .from("quiz_questions")
      .insert(questionsToInsert);

    if (insertError) throw new Error(`DB Insert Error: ${insertError.message}`);

    // Update Quiz Status
    await supabase
      .from("quizzes")
      .update({
        status: "ready",
        processing_state: "completed",
      })
      .eq("id", quizId);

    await sendProgress(100, "Done!");

    return new Response(
      JSON.stringify({ success: true, count: questions.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error(error);

    // Update Quiz Status to Failed
    // We need supabase client here too, might need to re-init if scope issue,
    // but simplified try/catch assumes we can just return error

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
