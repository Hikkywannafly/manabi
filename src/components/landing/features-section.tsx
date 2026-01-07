"use client";

import { motion } from "framer-motion";
import {
  ChevronDown,
  Eye,
  Hash,
  Languages,
  Lightbulb,
  MessageCircleQuestion,
  Plus,
  Rss,
  Settings,
  SkipForward,
  Sparkles,
  Trophy,
  User,
  WandSparkles,
  Zap,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Feature Quiz Component
function FeatureQuiz() {
  return (
    <motion.div
      className="mt-16 grid gap-16 md:mt-32 md:grid-cols-2 md:gap-0"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      {/* Quiz Phone Mockup */}
      <div className="col-span-1">
        <div className="relative mx-auto w-2/3 md:w-1/2">
          {/* Phone Frame */}
          <div className="rounded-[2.5rem] border-4 border-slate-800 bg-background p-3 shadow-2xl dark:border-slate-600">
            {/* Phone Screen */}
            <div className="rounded-[2rem] bg-secondary p-4">
              {/* Status Bar */}
              <div className="mb-4 flex items-center justify-between text-muted-foreground text-xs">
                <span>9:41</span>
                <div className="flex gap-1">
                  <div className="h-2 w-4 rounded-sm bg-muted-foreground" />
                </div>
              </div>

              {/* Quiz Content */}
              <div className="space-y-4">
                <div className="text-center">
                  <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary text-xs">
                    Question 3 of 10
                  </span>
                </div>

                <p className="font-medium text-foreground text-sm leading-relaxed">
                  Which data structure uses LIFO (Last In, First Out) principle?
                </p>

                {/* Options */}
                <div className="space-y-2">
                  <div className="rounded-lg border border-muted bg-background p-3 text-sm">
                    A. Queue
                  </div>
                  <div className="rounded-lg border-2 border-primary bg-primary/10 p-3 font-medium text-primary text-sm">
                    B. Stack ✓
                  </div>
                  <div className="rounded-lg border border-muted bg-background p-3 text-sm">
                    C. Linked List
                  </div>
                  <div className="rounded-lg border border-muted bg-background p-3 text-sm">
                    D. Array
                  </div>
                </div>

                {/* Progress */}
                <div className="pt-2">
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-[30%] rounded-full bg-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-16 w-full text-balance text-center md:w-4/5">
          <p className="font-semibold text-lg">
            Make learning fun with easy-to-use quizzes
          </p>
          <p className="mt-4 text-muted-foreground">
            Turn notes into active practice to help you remember more,
            understand better, and study less
          </p>
        </div>
      </div>

      {/* Quiz Settings */}
      <div className="col-span-1">
        <div className="relative mx-auto w-2/3 after:absolute after:bottom-0 after:left-0 after:h-32 after:w-full after:bg-gradient-to-t after:from-background after:to-transparent after:content-['']">
          <div className="space-y-4">
            <SettingItem icon={Eye} label="Visibility" value="Private" />
            <SettingItem
              icon={Languages}
              label="Language of the quiz"
              value="Auto detect"
            />
            <SettingItem
              icon={MessageCircleQuestion}
              label="Question type"
              value="Fill-in, MCQs"
            />
            <SettingItem icon={Hash} label="Number of questions" value="5-10" />
            <SettingItem icon={Rss} label="Mode" value="Quiz" />
          </div>
        </div>
        <div className="mx-auto mt-3 w-full text-balance text-center md:w-4/5">
          <p className="font-semibold text-lg">
            Build a quiz that fits your needs
          </p>
          <p className="mt-4 text-muted-foreground">
            Choose the language, question style, difficulty, and feedback
            options to match your learning preferences.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function SettingItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center font-medium text-muted-foreground text-sm">
        <Icon className="mr-2 size-4" />
        <span>{label}</span>
      </div>
      <button
        type="button"
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-secondary px-3 py-2 text-sm"
      >
        <span>{value}</span>
        <ChevronDown className="size-4 opacity-50" />
      </button>
    </div>
  );
}

// Feature AI Tutor
function FeatureAITutor() {
  return (
    <motion.div
      className="mt-16 grid gap-16 md:mt-32 md:grid-cols-2 md:gap-0"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <div className="col-span-1">
        <div className="relative mx-auto h-auto w-full rounded-md p-8 after:absolute after:bottom-0 after:left-0 after:h-32 after:w-full after:bg-gradient-to-t after:from-background after:to-transparent after:content-[''] md:w-2/3 md:p-0">
          {/* User Message */}
          <div className="flex justify-end gap-3">
            <div className="prose w-2/3 whitespace-normal break-words rounded-lg bg-primary p-2 text-primary-foreground">
              Explain why a program in execution is called a process.
            </div>
          </div>
          {/* AI Response */}
          <div className="mt-4 flex justify-start gap-3">
            <div className="flex flex-col gap-2 md:flex-row">
              <Avatar className="size-8 shrink-0">
                <AvatarImage src="/_static/logo/logo-light.png" alt="AI" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="prose prose-sm md:prose-base whitespace-normal break-words rounded-lg bg-secondary p-2 text-foreground">
                A process is a program in execution. It's more than just the
                code; it includes the program's code, data, and the resources
                allocated to run it. A process is a fundamental concept in
                operating systems.
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-16 w-full text-balance text-center md:w-4/5">
          <p className="font-semibold text-lg">Need help understanding?</p>
          <p className="mt-4 text-muted-foreground">
            Ask Manabi for clear and simple explanations to make learning easier
            and faster.
          </p>
        </div>
      </div>

      {/* Sharing Demo */}
      <div className="col-span-1">
        <div className="relative mx-auto h-auto w-full rounded-md md:w-3/4">
          <div className="relative flex w-full items-center justify-center overflow-hidden rounded-lg py-10">
            {/* SVG Connecting Lines */}
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 400 300"
              fill="none"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Line from User to Center */}
              <path
                d="M80 150 L160 150"
                stroke="#3B82F6"
                strokeWidth="2"
                fill="none"
              />
              {/* Lines from Center to Apps */}
              <path
                d="M200 150 Q 260 50, 320 50"
                stroke="#3B82F6"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M200 150 Q 260 100, 320 100"
                stroke="#3B82F6"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M200 150 L 320 150"
                stroke="#3B82F6"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M200 150 Q 260 200, 320 200"
                stroke="#3B82F6"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M200 150 Q 260 250, 320 250"
                stroke="#3B82F6"
                strokeWidth="2"
                fill="none"
              />
            </svg>

            <div className="relative z-10 flex w-full max-w-sm flex-row items-center justify-between">
              {/* User Icon */}
              <div className="flex flex-col justify-center">
                <div className="flex size-12 items-center justify-center rounded-full border-2 border-muted bg-background text-muted-foreground shadow-sm">
                  <User className="size-5" />
                </div>
              </div>

              {/* Center - Share/Transform Icon */}
              <div className="flex flex-col justify-center">
                <div className="flex size-14 items-center justify-center rounded-full border-2 border-muted bg-background text-foreground shadow-sm">
                  <WandSparkles className="size-6" />
                </div>
              </div>

              {/* App Icons */}
              <div className="flex flex-col items-center gap-3">
                {/* Google Drive */}
                <div className="flex size-10 items-center justify-center rounded-full border border-muted bg-background shadow-sm">
                  <svg viewBox="0 0 24 24" className="size-5" fill="none">
                    <path
                      d="M12 2L2 19.5h6.5L12 13l3.5 6.5H22L12 2z"
                      fill="#FFC107"
                    />
                    <path d="M2 19.5l3.5-6.5h13l3.5 6.5H2z" fill="#2196F3" />
                    <path d="M8.5 13L12 2l7.5 11H8.5z" fill="#4CAF50" />
                  </svg>
                </div>
                {/* Google Docs */}
                <div className="flex size-10 items-center justify-center rounded-full border border-muted bg-background shadow-sm">
                  <svg viewBox="0 0 24 24" className="size-5" fill="#4285F4">
                    <path d="M6 2a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6H6zm8 0l6 6h-6V2zM8 12h8v1.5H8V12zm0 3h8v1.5H8V15zm0 3h5v1.5H8V18z" />
                  </svg>
                </div>
                {/* WhatsApp */}
                <div className="flex size-10 items-center justify-center rounded-full border border-muted bg-background shadow-sm">
                  <svg viewBox="0 0 24 24" className="size-5" fill="#25D366">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                {/* Messenger */}
                <div className="flex size-10 items-center justify-center rounded-full border border-muted bg-background shadow-sm">
                  <svg
                    viewBox="0 0 24 24"
                    className="size-5"
                    fill="url(#messenger-gradient)"
                  >
                    <defs>
                      <linearGradient
                        id="messenger-gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#00B2FF" />
                        <stop offset="100%" stopColor="#FF00D4" />
                      </linearGradient>
                    </defs>
                    <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.858 1.385 5.407 3.546 7.075v3.682l3.477-1.912c.929.258 1.914.396 2.977.396 5.523 0 10-4.145 10-9.243C22 6.145 17.523 2 12 2zm1.066 12.426l-2.54-2.711-4.958 2.711 5.454-5.787 2.601 2.711 4.896-2.711-5.453 5.787z" />
                  </svg>
                </div>
                {/* Notion */}
                <div className="flex size-10 items-center justify-center rounded-full border border-muted bg-background shadow-sm">
                  <svg
                    viewBox="0 0 24 24"
                    className="size-5"
                    fill="currentColor"
                  >
                    <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.98-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.886l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952l1.448.327s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.62c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.886.747-.933zM2.24 1.688l13.59-.933c1.634-.14 2.054-.047 3.082.7l4.25 2.986c.7.513.933.653.933 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.948c0-.84.373-1.354 1.167-1.26z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-16 w-full text-balance text-center md:w-4/5">
          <p className="font-semibold text-lg">
            Easily share your study materials with others
          </p>
          <p className="mt-4 text-muted-foreground">
            Send your materials to friends, classmates, or students in just a
            few clicks and make learning collaborative
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Feature Flashcards
function FeatureFlashcards() {
  const flashcardData = [
    { topic: "Operating Systems", subtitle: "Process Management & Memory" },
    { topic: "Data Structures", subtitle: "Binary Trees & Algorithms" },
    { topic: "Networking", subtitle: "TCP/IP & OSI Model" },
  ];

  return (
    <motion.div
      className="mt-16 grid gap-16 md:mt-32 md:grid-cols-2 md:gap-0"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <div className="col-span-1 flex flex-col justify-between">
        <div className="relative mx-auto h-[300px] w-full md:w-3/4">
          <div className="relative h-full w-full">
            {flashcardData.map((card, index) => (
              <motion.div
                key={card.topic}
                className="absolute top-0 left-1/2 flex h-40 w-[90%] max-w-[320px] select-none flex-col justify-between overflow-hidden rounded-xl border-2 bg-secondary px-4 py-3 shadow-lg backdrop-blur-sm md:w-[22rem]"
                initial={{
                  x: "-50%",
                  y: index * 35,
                  rotate: (index - 1) * 3,
                }}
                animate={{
                  x: "-50%",
                  y: index * 35,
                  rotate: (index - 1) * 3,
                }}
                whileHover={{
                  y: index * 35 - 20,
                  scale: 1.02,
                  zIndex: 50,
                }}
                style={{ zIndex: flashcardData.length - index }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="flex items-center gap-2">
                  <span className="relative inline-block rounded-full bg-primary/20 p-1">
                    <Sparkles className="size-4 text-primary" />
                  </span>
                  <p className="font-medium text-lg text-primary">
                    {card.topic}
                  </p>
                </div>
                <p className="whitespace-nowrap text-base">{card.subtitle}</p>
                <p className="text-muted-foreground text-sm">
                  {index === 0
                    ? "Last studied 5m ago"
                    : index === 1
                      ? "Next review in 2h"
                      : "85% mastered"}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="mx-auto mt-8 w-full text-balance text-center md:w-4/5">
          <p className="font-semibold text-lg">
            Master content with flashcards
          </p>
          <p className="mt-4 text-muted-foreground">
            Create and study flashcards to reinforce your learning and track
            your progress over time
          </p>
        </div>
      </div>

      {/* Gamification */}
      <div className="col-span-1">
        <div className="relative grid gap-4 after:absolute after:bottom-0 after:left-0 after:h-32 after:w-full after:bg-gradient-to-t after:from-background after:to-transparent after:content-['']">
          {/* XP Card */}
          <div className="mx-auto w-full rounded-md md:w-3/4">
            <Card className="bg-secondary">
              <CardHeader className="pb-2">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">Level 5</h3>
                    <p className="text-muted-foreground text-sm">
                      Total XP: 1,250
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 text-lg"
                  >
                    <Sparkles className="size-4" />
                    438 / 506 XP
                  </Badge>
                </div>
                <Progress value={87} className="h-2" />
              </CardHeader>
            </Card>
          </div>

          {/* Leaderboard */}
          <div className="mx-auto w-full rounded-md md:w-3/4">
            <div className="space-y-2">
              {[
                { name: "Sarah Chen", level: 5, xp: 350, badge: "Power user" },
                { name: "Alex Kim", level: 4, xp: 280 },
                {
                  name: "Maria Garcia",
                  level: 3,
                  xp: 220,
                  badge: "Power user",
                },
              ].map((user, index) => (
                <div
                  key={user.name}
                  className="flex items-center rounded-lg bg-secondary p-3"
                >
                  <div className="w-8 flex-none text-center font-medium">
                    <Trophy
                      className={`mx-auto size-4 ${
                        index === 0
                          ? "text-yellow-500"
                          : index === 1
                            ? "text-gray-400"
                            : "text-amber-700"
                      }`}
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 items-center">
                    <Avatar className="mr-3 size-8">
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="truncate">
                      <p className="flex flex-wrap items-center gap-1 font-medium">
                        {user.name}
                        {user.badge && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/20 px-2 py-0.5 font-medium text-xs text-yellow-600 dark:text-yellow-500">
                            <Zap className="size-3" />
                            {user.badge}
                          </span>
                        )}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Level {user.level}
                      </p>
                    </div>
                  </div>
                  <div className="flex-none text-right">
                    <p className="flex items-center gap-1 font-medium">
                      <Sparkles className="size-4" />
                      {user.xp} XP
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mx-auto mt-16 w-full text-balance text-center md:w-4/5">
          <p className="font-semibold text-lg">
            Make learning fun and engaging
          </p>
          <p className="mt-4 text-muted-foreground">
            Earn XP, complete missions, climb the leaderboard and maintain your
            streak as you learn and grow
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Feature Pomodoro & Kanban
function FeaturePomodoroKanban() {
  return (
    <>
      {/* Pomodoro - Full Width Section */}
      <div className="mt-16 md:mt-32">
        <div className="relative mx-auto w-full overflow-hidden rounded-2xl">
          {/* Background Scene - Lofi Study Room */}
          <div className="relative h-[500px] w-full overflow-hidden bg-slate-900 sm:h-[600px]">
            {/* Background Video */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover opacity-80"
              src="https://1230610135274225734.discordsays.com/.proxy/static-assets/scenes/chill-vibes/bedroom/videos/day-rain.mp4"
            />
            {/* Dark overlay for contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
              {/* No active task pill */}
              <div className="mb-4 flex items-center gap-2 rounded-full bg-black/30 px-4 py-1.5 backdrop-blur-sm">
                <span className="font-medium text-sm text-white/70">
                  No active task
                </span>
              </div>

              {/* Mode Indicators (Dots) */}
              <div className="mb-6 flex items-center gap-3">
                <button
                  type="button"
                  className="size-3 scale-125 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                  title="Focus"
                />
                <button
                  type="button"
                  className="size-3 rounded-full bg-white/30 hover:bg-white/50"
                  title="Short Break"
                />
                <button
                  type="button"
                  className="size-3 rounded-full bg-white/30 hover:bg-white/50"
                  title="Long Break"
                />
              </div>

              {/* Large Timer Display */}
              <div className="relative mb-4">
                <div className="select-none font-bold text-[8rem] text-white tracking-tighter drop-shadow-2xl sm:text-[10rem] md:text-[12rem]">
                  25:00
                </div>
                {/* Session Counter */}
                <div className="-bottom-2 -translate-x-1/2 absolute left-1/2 whitespace-nowrap">
                  <span className="font-medium text-sm text-white/60 uppercase tracking-widest">
                    Focus • 0/4
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="mt-6 flex items-center gap-6">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-10 rounded-full text-white/70 hover:bg-white/10 hover:text-white"
                >
                  <Settings className="size-5" />
                </Button>

                <Button className="h-14 min-w-[140px] rounded-full bg-white font-bold text-black text-lg hover:bg-white/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                  Start
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="size-10 rounded-full text-white/50 hover:bg-white/10"
                >
                  <SkipForward className="size-5" />
                </Button>
              </div>

              {/* Task Input */}
              <div className="mt-8">
                <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 backdrop-blur-sm">
                  <span className="text-sm text-white/50">
                    What are you working on?
                  </span>
                  <Plus className="size-4 text-white/50" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mx-auto mt-8 w-full text-balance text-center md:w-4/5">
          <p className="font-semibold text-lg">
            Stay focused with the Pomodoro Timer
          </p>
          <p className="mt-4 text-muted-foreground">
            Break down your study sessions into focused intervals with short
            breaks to maximize productivity.
          </p>
        </div>
      </div>

      {/* Kanban - Full Width Section */}
      <div className="mt-16 md:mt-32">
        <div className="relative mx-auto h-[450px] w-full overflow-hidden rounded-2xl bg-background shadow-lg">
          <div className="flex h-full flex-col bg-background p-4">
            <div className="mt-4 flex flex-1 gap-4 overflow-x-auto">
              {/* To Do Column */}
              <KanbanColumn
                title="To Do"
                color="bg-amber-50 dark:bg-amber-900/20"
                dotColor="bg-primary"
                tasks={[
                  {
                    title: "Plan project structure",
                    desc: "Outline main components",
                  },
                  {
                    title: "Set up database schema",
                    desc: "Define models and relations",
                  },
                ]}
              />
              {/* In Progress Column */}
              <KanbanColumn
                title="In Progress"
                color="bg-blue-50 dark:bg-blue-900/20"
                dotColor="bg-[hsl(var(--chart-1))]"
                tasks={[
                  {
                    title: "Develop authentication",
                    desc: "Implement login/signup flow",
                  },
                ]}
              />
              {/* Done Column */}
              <KanbanColumn
                title="Done"
                color="bg-green-50 dark:bg-emerald-900/20"
                dotColor="bg-[hsl(var(--chart-5))]"
                tasks={[
                  {
                    title: "Design landing page",
                    desc: "Create initial mockups",
                  },
                ]}
              />
            </div>
          </div>
        </div>
        <div className="mx-auto mt-8 w-full text-balance text-center md:w-4/5">
          <p className="font-semibold text-lg">
            Organize your tasks with a Kanban Board
          </p>
          <p className="mt-4 text-muted-foreground">
            Keep your study tasks organized and track your progress
          </p>
        </div>
      </div>
    </>
  );
}

function KanbanColumn({
  title,
  color,
  dotColor,
  tasks,
}: {
  title: string;
  color: string;
  dotColor: string;
  tasks: { title: string; desc: string }[];
}) {
  return (
    <Card
      className={`flex h-full min-h-96 flex-1 shrink-0 flex-col rounded-md ${color}`}
      style={{ flexBasis: "18rem" }}
    >
      <CardHeader className="border-b p-3">
        <h3 className="flex items-center justify-between font-semibold text-sm tracking-tight">
          <div className="flex items-center gap-2">
            <span className={`size-2 rounded-full ${dotColor}`} />
            <span>{title}</span>
          </div>
          <span className="rounded bg-background/80 px-1.5 py-0.5 text-muted-foreground text-xs">
            {tasks.length}
          </span>
        </h3>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-2">
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.title}
              className="relative cursor-grab overflow-hidden rounded-md border bg-secondary p-2 text-card-foreground shadow-sm"
            >
              <p className="min-w-0 flex-1 break-words font-bold text-sm leading-tight">
                {task.title}
              </p>
              <p className="mt-1 break-words text-muted-foreground text-xs">
                {task.desc}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Main Features Section
export function FeaturesSection() {
  return (
    <section id="features" className="py-12 md:py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="mb-8 inline-block rounded-xl bg-primary px-4 py-2 font-medium text-primary-foreground text-sm">
            <Lightbulb className="mr-2 inline-block size-4" />
            <span>There is a better way</span>
          </span>
          <div className="flex w-full flex-col items-center justify-center">
            <h2 className="max-w-3xl font-bold text-3xl tracking-tight sm:text-4xl">
              Turn your notes into quizzes & flashcards for easy recall
            </h2>
            <p className="mx-auto mt-8 max-w-xl text-muted-foreground">
              An easier way to study that helps you focus, remember better, and
              feel more prepared.
            </p>
          </div>
        </motion.div>

        <FeatureQuiz />
        <FeatureAITutor />
        <FeatureFlashcards />
        <FeaturePomodoroKanban />
      </div>
    </section>
  );
}
