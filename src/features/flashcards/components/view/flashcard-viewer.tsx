"use client";

import { motion } from "framer-motion";
import { Edit3, Maximize2, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { FlashcardWithReview } from "../../types";

interface FlashcardViewerProps {
  card: FlashcardWithReview;
  onEdit?: (card: FlashcardWithReview) => void;
  isFlipped?: boolean;
  fontSize?: "xs" | "normal" | "large" | "xlarge" | "xxlarge";
  onToggleFontSize?: () => void;
}

export function FlashcardViewer({
  card,
  onEdit,
  isFlipped: orderFlipped = false,
  fontSize = "normal",
  onToggleFontSize,
}: FlashcardViewerProps) {
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Reset flip state when card changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: We intentionally reset when card.id changes
  useEffect(() => {
    setIsCardFlipped(false);
  }, [card.id]);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleFlip = () => {
    setIsCardFlipped((prev) => !prev);
  };

  const handleSpeak = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      console.warn("Text-to-speech is not supported in this browser");
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Clean text - remove markdown syntax for better speech
    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, "$1") // Bold
      .replace(/\*(.*?)\*/g, "$1") // Italic
      .replace(/`(.*?)`/g, "$1") // Code
      .replace(/#{1,6}\s?/g, "") // Headers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Links
      .replace(/[-*+]\s/g, "") // List markers
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Try to detect language (simple heuristic)
    const hasVietnamese =
      /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i.test(
        cleanText,
      );
    const hasJapanese = /[\u3040-\u30ff\u4e00-\u9faf]/i.test(cleanText);
    const hasChinese = /[\u4e00-\u9fff]/i.test(cleanText);
    const hasKorean = /[\uac00-\ud7af]/i.test(cleanText);

    if (hasVietnamese) utterance.lang = "vi-VN";
    else if (hasJapanese) utterance.lang = "ja-JP";
    else if (hasChinese) utterance.lang = "zh-CN";
    else if (hasKorean) utterance.lang = "ko-KR";
    else utterance.lang = "en-US";

    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  const handleStopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Determine which content to show based on both flip states
  const frontContent = orderFlipped ? card.back : card.front;
  const backContent = orderFlipped ? card.front : card.back;

  // Font size classes
  const fontSizeClasses = {
    xs: "prose-sm text-sm",
    normal: "prose-base text-base",
    large: "prose-lg text-lg",
    xlarge: "prose-xl text-xl",
    xxlarge: "prose-2xl text-2xl",
  };

  const VolumeIcon = isSpeaking ? VolumeX : Volume2;

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Viewer Container */}
      <div className="perspective-1000 relative h-[400px] w-full">
        <motion.div
          className="preserve-3d relative h-full w-full cursor-pointer"
          animate={{ rotateY: isCardFlipped ? 180 : 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          onClick={handleFlip}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front */}
          <div
            className="backface-hidden absolute inset-0"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="flex h-full flex-col justify-between rounded-xl border bg-card p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex justify-between text-muted-foreground">
                <div className="flex gap-1">
                  {onEdit && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(card);
                          }}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit card</TooltipContent>
                    </Tooltip>
                  )}
                  {onToggleFontSize && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFontSize();
                          }}
                        >
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Zoom (
                        {fontSize === "normal"
                          ? "Normal"
                          : fontSize === "large"
                            ? "Large"
                            : "Extra Large"}
                        )
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn("h-8 w-8", isSpeaking && "text-primary")}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isSpeaking) {
                          handleStopSpeaking();
                        } else {
                          handleSpeak(frontContent);
                        }
                      }}
                    >
                      <VolumeIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isSpeaking ? "Stop speaking" : "Read aloud"}
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex flex-1 items-center justify-center overflow-y-auto text-center">
                <div
                  className={cn(
                    "prose dark:prose-invert max-w-none",
                    fontSizeClasses[fontSize],
                  )}
                >
                  <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {frontContent}
                  </ReactMarkdown>
                </div>
              </div>
              <div className="text-center text-muted-foreground text-sm uppercase tracking-wider">
                Click to flip
              </div>
            </div>
          </div>

          {/* Back */}
          <div
            className="backface-hidden absolute inset-0"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="flex h-full flex-col justify-between rounded-xl border bg-card p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex justify-between text-muted-foreground">
                <div className="flex gap-1">
                  {onEdit && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(card);
                          }}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit card</TooltipContent>
                    </Tooltip>
                  )}
                  {onToggleFontSize && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFontSize();
                          }}
                        >
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Zoom (
                        {fontSize === "normal"
                          ? "Normal"
                          : fontSize === "large"
                            ? "Large"
                            : "Extra Large"}
                        )
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn("h-8 w-8", isSpeaking && "text-primary")}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isSpeaking) {
                          handleStopSpeaking();
                        } else {
                          handleSpeak(backContent);
                        }
                      }}
                    >
                      <VolumeIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isSpeaking ? "Stop speaking" : "Read aloud"}
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center gap-4 overflow-y-auto text-center">
                <div
                  className={cn(
                    "prose dark:prose-invert max-w-none",
                    fontSizeClasses[fontSize],
                  )}
                >
                  <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {backContent}
                  </ReactMarkdown>
                </div>
              </div>
              <div className="text-center text-muted-foreground text-sm uppercase tracking-wider">
                Click to flip back
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
