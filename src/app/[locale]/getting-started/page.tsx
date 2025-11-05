"use client";

import { useState } from "react";
// import { completeSurvey, skipSurvey } from "@/app/api/auth/actions";
import { PageLayout } from "@/components/layouts";
import { Logo } from "@/components/logo";
import { OptionButton } from "@/components/option-button";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function GettingStartedPage() {
  // const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const surveyQuestions = [
    {
      id: "goal",
      question: "Mục tiêu chính của bạn là gì?",
      options: ["Học ngoại ngữ", "Phát triển kỹ năng lập trình", "Khác"],
    },
    {
      id: "level",
      question: "Trình độ hiện tại của bạn?",
      options: ["Người mới bắt đầu", "Trung bình", "Nâng cao"],
    },
    {
      id: "time",
      question: "Bạn có bao nhiêu thời gian mỗi tuần?",
      options: ["< 5 giờ", "5-10 giờ", "> 10 giờ"],
    },
  ];

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = async () => {
    if (step < surveyQuestions.length) {
      setStep(step + 1);
    } else {
      setLoading(true);
      // const result = await completeSurvey(answers);
      setLoading(false);
      // if (!result.error) {
      //   router.push("/dashboard");
      // }
    }
  };

  const handleSkip = async () => {
    setLoading(true);
    // const result = await ();
    setLoading(false);
    // if (!result.error) {
    //   router.push("/dashboard");
    // }
  };

  const currentQuestion = surveyQuestions[step - 1];
  const progress = (step / surveyQuestions.length) * 100;

  return (
    <PageLayout variant="gradient" showHeader={false}>
      <div className="flex h-full items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8">
          <Logo size="md" className="mx-auto w-fit" />

          <div className="space-y-6">
            <div>
              <h1 className="font-bold text-2xl">Chào mừng!</h1>
              <p className="mt-2 text-muted-foreground text-sm">
                Trả lời vài câu hỏi để chúng tôi gợi ý tài liệu phù hợp
              </p>
            </div>

            <Progress value={progress} className="h-2" />

            <div className="space-y-4">
              <h2 className="font-semibold text-lg">
                {currentQuestion.question}
              </h2>
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <OptionButton
                    key={option}
                    option={option}
                    isSelected={answers[currentQuestion.id] === option}
                    showCheckbox={false}
                    onClick={() => handleAnswer(currentQuestion.id, option)}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="flex-1"
                >
                  Quay lại
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={!answers[currentQuestion.id] || loading}
                className="flex-1"
              >
                {step === surveyQuestions.length ? "Hoàn thành" : "Tiếp theo"}
              </Button>
            </div>

            <Button
              variant="ghost"
              onClick={handleSkip}
              disabled={loading}
              className="w-full"
            >
              Bỏ qua
            </Button>

            <p className="text-center text-muted-foreground text-xs">
              Bước {step} / {surveyQuestions.length}
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
