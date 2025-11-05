"use client";

import { BookOpen, Brain, CheckSquare, Clock, Trophy, Zap } from "lucide-react";
import { useState } from "react";
// import { completeSurvey, skipSurvey } from "@/app/api/auth/actions";
import { PageLayout } from "@/components/layouts";
import { Logo } from "@/components/logo";
import { OptionButton } from "@/components/option-button";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const features = [
  {
    icon: Zap,
    title: "AI Flashcards",
    description: "Generate smart flashcards from your notes",
  },
  {
    icon: BookOpen,
    title: "AI Quizzes",
    description: "Create practice tests automatically",
  },
  {
    icon: Brain,
    title: "AI Tutor",
    description: "Get personalized help and explanations",
  },
  {
    icon: Clock,
    title: "Pomodoro Timer",
    description: "Stay focused with time management",
  },
  {
    icon: CheckSquare,
    title: "Kanban Board",
    description: "Organize tasks and track progress",
  },
  {
    icon: Trophy,
    title: "Gamification",
    description: "Earn XP, streaks, and achievements",
  },
];

export default function GettingStartedPage() {
  // const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const surveyQuestions = [
    {
      id: "name",
      question: "What should we call you?",
      subtitle: "This helps us personalize your StudyOn experience.",
      type: "input",
      options: [],
      multiple: false,
    },
    {
      id: "who",
      question: "Who are you?",
      subtitle:
        "This helps us tailor StudyOn to your specific learning needs and goals.",
      type: "select",
      options: ["Student", "Teacher", "Professional", "Lifelong Learner"],
      multiple: false,
    },
    {
      id: "found",
      question: "How did you find us?",
      subtitle:
        "Help us understand how people discover StudyOn so we can continue to improve.",
      type: "select",
      options: [
        "Search Engine",
        "Social Media",
        "Friend Recommendation",
        "App Store",
        "Other",
      ],
      multiple: false,
    },
  ];

  const handleAnswer = (questionId: string, answer: string) => {
    const question = surveyQuestions.find((q) => q.id === questionId);
    if (question?.multiple) {
      // Multi-select: toggle answer
      const current = answers[questionId]?.split(",") || [];
      if (current.includes(answer)) {
        const filtered = current.filter((a) => a !== answer);
        setAnswers((prev) => ({
          ...prev,
          [questionId]: filtered.join(","),
        }));
      } else {
        setAnswers((prev) => ({
          ...prev,
          [questionId]: [...current, answer].join(","),
        }));
      }
    } else {
      // Single select
      setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    }
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
  const isInputStep = currentQuestion.type === "input";

  return (
    <PageLayout variant="gradient" showHeader={false}>
      {step === 1 && !isInputStep ? (
        // Welcome Screen
        <div className="flex h-full items-center justify-center px-4">
          <div className="w-full max-w-2xl space-y-12">
            <div className="space-y-4 text-center">
              <Logo size="md" className="mx-auto w-fit" />
              <h1 className="font-bold text-4xl">Welcome to Manabi</h1>
              <p className="text-lg text-muted-foreground">
                StudyOn helps you study better with AI-powered tools designed to
                enhance your learning experience.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="flex flex-col items-start gap-3 rounded-lg border border-input bg-background p-6 transition-colors hover:bg-accent/50"
                  >
                    <Icon className="size-6 text-primary" />
                    <div className="space-y-1">
                      <h3 className="font-semibold text-sm">{feature.title}</h3>
                      <p className="text-muted-foreground text-xs">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* How It Works */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="font-bold text-2xl">How StudyOn Works</h2>
                <p className="mt-2 text-muted-foreground text-sm">
                  Transform your study materials into interactive learning
                  experiences in just a few simple steps.
                </p>
              </div>

              <div className="space-y-4">
                {/* Step 1 */}
                <div className="space-y-3 rounded-lg border border-input bg-background/50 p-6">
                  <div className="flex gap-4">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground text-xs">
                      1
                    </div>
                    <div className="space-y-1 pt-0.5">
                      <p className="font-semibold text-sm">
                        Upload your notes or study materials
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Start by sharing your notes or study materials with
                        StudyOn
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="space-y-3 rounded-lg border border-input bg-background/50 p-6">
                  <div className="flex gap-4">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground text-xs">
                      2
                    </div>
                    <div className="space-y-1 pt-0.5">
                      <p className="font-semibold text-sm">
                        Our AI analyzes and creates content
                      </p>
                      <p className="text-muted-foreground text-xs">
                        StudyOn uses advanced AI to generate flashcards,
                        quizzes, and personalized study plans
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="space-y-3 rounded-lg border border-input bg-background/50 p-6">
                  <div className="flex gap-4">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground text-xs">
                      3
                    </div>
                    <div className="space-y-1 pt-0.5">
                      <p className="font-semibold text-sm">
                        Start learning smarter
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Use interactive tools and track your progress with
                        gamification
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button onClick={() => setStep(2)} className="w-full" size="lg">
              Get Started
            </Button>
          </div>
        </div>
      ) : (
        // Survey Steps
        <div className="flex h-full items-center justify-center px-4">
          <div className="w-full max-w-md space-y-8">
            <Logo size="md" className="mx-auto w-fit" />

            <div className="space-y-6">
              <div>
                <h1 className="font-bold text-2xl">
                  {currentQuestion.question}
                </h1>
                <p className="mt-2 text-muted-foreground text-sm">
                  {currentQuestion.subtitle}
                </p>
              </div>

              <Progress value={progress} className="h-2" />

              <div className="space-y-4">
                {isInputStep ? (
                  <input
                    type="text"
                    placeholder="Enter your answer"
                    value={answers[currentQuestion.id] || ""}
                    onChange={(e) =>
                      handleAnswer(currentQuestion.id, e.target.value)
                    }
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm transition-colors placeholder:text-muted-foreground hover:border-accent focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  />
                ) : (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option) => {
                      const selectedAnswers =
                        answers[currentQuestion.id]?.split(",") || [];
                      const isSelected = selectedAnswers.includes(option);
                      return (
                        <OptionButton
                          key={option}
                          option={option}
                          isSelected={isSelected}
                          showCheckbox={currentQuestion.multiple}
                          onClick={() =>
                            handleAnswer(currentQuestion.id, option)
                          }
                        />
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                {step > 1 && (
                  <Button
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  disabled={!answers[currentQuestion.id] || loading}
                  className="flex-1"
                >
                  {step === surveyQuestions.length ? "Complete" : "Next"}
                </Button>
              </div>

              <Button
                variant="ghost"
                onClick={handleSkip}
                disabled={loading}
                className="w-full"
              >
                Skip
              </Button>

              <p className="text-center text-muted-foreground text-xs">
                Step {step - 1} / {surveyQuestions.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
