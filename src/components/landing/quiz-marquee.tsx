"use client";

import { motion } from "framer-motion";

import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { Link } from "@/i18n/routing";

const publicQuizzes = [
  {
    id: "cmjlenkou00hdolcw5klnad8j",
    title: "Trắc nghiệm Triết học và Xã hội học",
    slug: "trac-nghiem-triet-hoc-va-xa-hoi-hoc",
    author: "Sksk Sksj",
    date: "5d ago",
  },
  {
    id: "cmjgqng31005solcw2wq0qysn",
    title: "Câu hỏi trắc nghiệm Lịch sử Đảng Cộng sản Việt Nam",
    slug: "cau-hoi-trac-nghiem-lich-su-djang-cong-san-viet-nam",
    author: "31.Quyết Nguyễn",
    date: "8d ago",
  },
  {
    id: "cmiq3wudp018why1fd2xdtpwv",
    title: "Social Psychology Quiz",
    slug: "social-psychology-quiz",
    author: "Kimini",
    date: "27d ago",
  },
  {
    id: "cmichjikg0989p0eu69svkll8",
    title: "EMT Basic Medical/Trauma Quiz",
    slug: "emt-basic-medicaltrauma-quiz",
    author: "Shakeer Farihin",
    date: "36d ago",
  },
  {
    id: "cmhufir5805vop0eu2nypxk33",
    title: "Operating System Design Challenges",
    slug: "operating-system-design-challenges",
    author: "Saarvik",
    date: "49d ago",
  },
];

export function QuizMarquee() {
  return (
    <div className="mt-16 w-full">
      {/* Text Content - Centered */}
      <motion.div
        className="mx-auto text-balance text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <p className="font-semibold text-lg">Still not sure how it works?</p>
        <p className="mt-4 text-muted-foreground">
          Take a quick look at a quiz made by others!
        </p>
      </motion.div>

      {/* Slider - Full Width */}
      <div className="relative mt-12 w-full overflow-hidden">
        <InfiniteSlider speed={30} className="py-2">
          {publicQuizzes.map((quiz) => (
            <Link
              key={quiz.id}
              href={`/quiz/${quiz.id}/${quiz.slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex h-32 w-72 flex-col justify-between gap-2 rounded-lg bg-secondary p-4 text-start shadow-md transition-transform hover:scale-105">
                <div>
                  <h3 className="line-clamp-1 font-semibold">{quiz.title}</h3>
                  <div className="relative mt-1 flex h-max items-center gap-1">
                    <p className="text-muted-foreground text-sm">
                      {quiz.author}
                    </p>
                  </div>
                </div>
                <div className="text-muted-foreground text-sm">{quiz.date}</div>
              </div>
            </Link>
          ))}
        </InfiniteSlider>

        {/* Fade gradients - using background color */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
      </div>
    </div>
  );
}
