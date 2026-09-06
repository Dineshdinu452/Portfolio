"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { AboutMeCard } from "./AboutMeCard";
import { CatMascot } from "./CatMascot";
import { ContactCard } from "./ContactCard";
import { ExperienceCard } from "./ExperienceCard";
import { ProjectCard } from "./ProjectCard";
import { TestimonialsCard } from "./TestimonialsCard";
import { ThemeToggle } from "./ThemeToggle";

const RAINBOW_GRADIENT =
  "linear-gradient(90deg, #ff5252 0%, #ffb03a 16.67%, #ffe74a 33.33%, #4ade80 50%, #38bdf8 66.67%, #a78bfa 83.33%, #ff5252 100%)";

const PROFILE_BIG = { size: 306, radius: 76 };
const PROFILE_SMALL = { size: 70, radius: 17.5 };

const CAT_START_LEFT = 23;
const CAT_START_TOP = -65;
const CAT_END_RIGHT_INSET = -55;
const CAT_END_BOTTOM_OVERHANG = 5;
const CAT_BOTTOM_THRESHOLD = 0.95;

const PROJECT_IMAGES = [
  "/images/project1bg.png",
  "/images/project2bg.png",
  "/images/project3bg.png",
];

const QUICK_REPLIES = [
  "My experience",
  "How I use AI",
  "About me",
  "Contact",
  "What people say",
];

const QUICK_REPLY_RESPONSES: Record<string, string> = {
  "About me": "Happy to share more than the resume version:",
  "My experience": "Here's where I've been:",
};

const WRAP_MESSAGES: Record<string, string> = {
  "About me":
    "Holla !! That's a wrap on me. Dig into my experience, see how I use AI, hear the receipts, or hit me up directly.",
  "My experience":
    "Mostly B2B SaaS, dashboards, workflows, and the unglamorous-but-critical screens people live in every day.",
  "What people say": "Want to talk to me? Happy to connect you.",
};

// Chat progression: 0 idle, 1 typing, 2 msg1, 3 msg2, 4 "My work" reply,
// 5 project cards, 6 closing typing, 7 closing message, 8 quick-reply pills.
const CHAT_STEP_DELAYS = [3300, 4000, 4500, 5200, 6100, 8100, 9100, 9800];

function formatTimestamp(date: Date) {
  const day = date.getDate();
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  return `${day} ${weekday}, ${time}`;
}

export function Hero() {
  const [showContent, setShowContent] = useState(false);
  const [showDivider, setShowDivider] = useState(false);
  const [chatStep, setChatStep] = useState(0);
  const [timestamp, setTimestamp] = useState<string | null>(null);
  const [cardHeight, setCardHeight] = useState<number>(520);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [replyThreads, setReplyThreads] = useState<string[]>([]);
  const [latestRevealed, setLatestRevealed] = useState(false);
  const [latestWrapStep, setLatestWrapStep] = useState<0 | 1 | 2>(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const contentTimer = setTimeout(() => setShowContent(true), 450);
    const dividerTimer = setTimeout(() => {
      setTimestamp(formatTimestamp(new Date()));
      setShowDivider(true);
    }, CHAT_STEP_DELAYS[0]);
    const chatTimers = CHAT_STEP_DELAYS.map((delay, i) =>
      setTimeout(() => setChatStep(i + 1), delay)
    );
    return () => {
      clearTimeout(contentTimer);
      clearTimeout(dividerTimer);
      chatTimers.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (!showDivider && chatStep === 0) return;
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  }, [showDivider, chatStep, replyThreads, latestRevealed, latestWrapStep]);

  useEffect(() => {
    if (chatStep < 4) return;
    const el = contentRef.current;
    if (el) setCardHeight(el.scrollHeight);
  }, [chatStep, replyThreads, latestRevealed, latestWrapStep]);

  useEffect(() => {
    const latestLabel = replyThreads[replyThreads.length - 1];
    if (!(latestRevealed && latestLabel && WRAP_MESSAGES[latestLabel])) return;
    const typingTimer = setTimeout(() => setLatestWrapStep(1), 700);
    const revealTimer = setTimeout(() => setLatestWrapStep(2), 1700);
    return () => {
      clearTimeout(typingTimer);
      clearTimeout(revealTimer);
    };
  }, [latestRevealed, replyThreads]);

  useEffect(() => {
    if (replyThreads.length === 0 || latestRevealed) return;
    const timer = setTimeout(() => setLatestRevealed(true), 1000);
    return () => clearTimeout(timer);
  }, [replyThreads, latestRevealed]);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    function handleTransitionEnd(e: TransitionEvent) {
      if (e.propertyName !== "height") return;
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }
    el.addEventListener("transitionend", handleTransitionEnd);
    return () => el.removeEventListener("transitionend", handleTransitionEnd);
  }, []);

  useEffect(() => {
    let ticking = false;

    function updateScale() {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      setScrollProgress(Math.min(Math.max(progress, 0), 1));
      ticking = false;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateScale);
    }

    updateScale();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  function handleReplyClick(label: string) {
    setReplyThreads((prev) => [...prev, label]);
    setLatestRevealed(false);
    setLatestWrapStep(0);
  }

  const isChatting = chatStep >= 1;
  const profile = isChatting ? PROFILE_SMALL : PROFILE_BIG;
  const bgScale = 1 + scrollProgress * 0.1;
  const isCatAtBottom = scrollProgress >= CAT_BOTTOM_THRESHOLD;
  // Anchored to the container's own edges (not a hardcoded card width), so it
  // tracks the container's real size instead of assuming a fixed layout.
  const catPosition: React.CSSProperties = isCatAtBottom
    ? { right: CAT_END_RIGHT_INSET, bottom: CAT_END_BOTTOM_OVERHANG }
    : { left: CAT_START_LEFT, top: CAT_START_TOP };

  const lastReplyLabel = replyThreads[replyThreads.length - 1] ?? null;
  const lastReplyHasWrap = lastReplyLabel
    ? !!WRAP_MESSAGES[lastReplyLabel]
    : false;
  const showFollowUpPills =
    replyThreads.length > 0 &&
    (lastReplyHasWrap ? latestWrapStep >= 2 : latestRevealed);
  const remainingQuickReplies = QUICK_REPLIES.filter(
    (label) => !replyThreads.includes(label)
  );

  return (
    <section className="relative flex min-h-dvh w-full flex-col items-center justify-start overflow-hidden px-4 pb-24 pt-[128px] sm:px-8">
      <div
        aria-hidden
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `url("/images/hero/background.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          transform: `scale(${bgScale})`,
          transformOrigin: "center",
          transition: "transform 0.2s ease-out",
        }}
      />

      <div className="fixed right-8 top-4 z-50 sm:top-6">
        <div className="relative">
          <div
            aria-hidden
            className="absolute -inset-[3px] rounded-full opacity-55 blur-[9px]"
            style={{ backgroundImage: RAINBOW_GRADIENT }}
          />
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="relative block rounded-full p-px"
            style={{ backgroundImage: RAINBOW_GRADIENT }}
          >
            <span className="relative flex h-[41px] items-center justify-center gap-2 overflow-hidden rounded-full bg-black px-[19px]">
              <span
                aria-hidden
                className="absolute inset-y-0 w-[156px]"
                style={{
                  left: "66.21px",
                  backgroundImage:
                    "linear-gradient(135.55deg, rgba(255,255,255,0) 37.321%, rgba(255,255,255,0.32) 50%, rgba(255,255,255,0) 62.679%)",
                }}
              />
              <span className="relative font-manrope text-[14px] font-medium tracking-[0.56px] text-white">
                Resume
              </span>
              <img
                src="/icons/download.svg"
                alt=""
                className="relative size-[13px]"
              />
            </span>
          </a>
        </div>
      </div>

      <div className="relative z-10 w-[700px] max-w-full">
        {showContent && (
          <CatMascot
            key={isCatAtBottom ? "bottom" : "top"}
            flipped={isCatAtBottom}
            driftAxis={isCatAtBottom ? "vertical" : "horizontal"}
            className="absolute z-20"
            style={{
              ...catPosition,
              animation: `clarity-reveal ${
                isCatAtBottom ? "0.45s" : "1.8s"
              } cubic-bezier(0.16,1,0.3,1) both`,
            }}
          />
        )}

        <div
          ref={cardRef}
          className="relative w-[700px] max-w-full overflow-hidden rounded-[20px] border border-white/60 bg-white/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          style={{
            height: cardHeight,
            transition: "height 0.6s cubic-bezier(0.16,1,0.3,1)",
            animation: "card-pop-in 0.6s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          {showContent && (
            <ThemeToggle
              className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6"
              style={{ animation: "clarity-reveal 1.8s cubic-bezier(0.16,1,0.3,1) both" }}
            />
          )}

          <div
            ref={contentRef}
            className="flex w-full flex-col items-center gap-[32px] px-6 pb-[100px] pt-6 sm:px-8 sm:pt-8"
          >
            {showContent && (
              <div
                className="relative shrink-0 overflow-hidden border-[#e5e2dc]"
                style={{
                  width: profile.size,
                  height: profile.size,
                  borderRadius: profile.radius,
                  borderWidth: isChatting ? 1 : 5,
                  animation: "clarity-reveal 1.8s cubic-bezier(0.16,1,0.3,1) both",
                  transition:
                    "width 1.1s cubic-bezier(0.16,1,0.3,1), height 1.1s cubic-bezier(0.16,1,0.3,1), border-radius 1.1s cubic-bezier(0.16,1,0.3,1), border-width 1.1s cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                <Image
                  src="/images/hero/profile.png"
                  alt="Portrait of Dinesh"
                  fill
                  priority
                  sizes="306px"
                  className="object-cover object-top"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.28) 50%, transparent 65%)",
                    animation: "shimmer-sweep 3.6s ease-in-out infinite",
                  }}
                />
              </div>
            )}

            {showContent && (
              <div
                className="flex flex-col items-center gap-2 px-2 text-center"
                style={{ animation: "clarity-reveal 1.8s cubic-bezier(0.16,1,0.3,1) both" }}
              >
                <h1 className="font-script text-[26px] leading-tight text-[#202937] sm:text-[28px]">
                  Hey, I&apos;m Dinesh
                </h1>
                <p className="font-body max-w-[420px] text-[15px] leading-relaxed text-[#524f4c] sm:text-base">
                  I question, design, refine, and ship
                  <br />
                  taking messy ideas and making them work better.
                </p>
              </div>
            )}

            {showDivider && timestamp && (
              <div
                className="flex w-full items-center gap-[6px]"
                style={{ animation: "chat-row-in 0.5s ease-out both" }}
              >
                <div className="h-px flex-1 bg-[#c7c4c0]" />
                <p className="font-body whitespace-nowrap text-[13px] font-medium text-[#7a736c]">
                  {timestamp}
                </p>
                <div className="h-px flex-1 bg-[#c7c4c0]" />
              </div>
            )}

            {isChatting && (
              <div
                className="flex w-full flex-col gap-3"
                style={{ animation: "chat-row-in 0.5s ease-out both" }}
              >
                <div className="flex w-full items-end gap-3">
                  <div className="relative size-8 shrink-0 overflow-hidden rounded-full border border-[#e5e2dc]">
                    <Image
                      src="/images/hero/profile.png"
                      alt=""
                      fill
                      sizes="32px"
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="flex flex-1 flex-col items-start gap-2">
                    <span className="font-body pl-1 text-[12px] font-medium text-[#7a736c]">
                      Dinesh
                    </span>

                    {chatStep === 1 && (
                      <div className="flex min-h-[46px] items-center gap-1 rounded-tl-[12px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[4px] bg-[#f6f6f6] px-4 py-3">
                        {[0, 150, 300].map((delay) => (
                          <span
                            key={delay}
                            className="size-[6px] rounded-full bg-[#a8a29e]"
                            style={{
                              animation: "typing-bounce 1.2s ease-in-out infinite",
                              animationDelay: `${delay}ms`,
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {chatStep >= 2 && (
                      <div
                        className="flex min-h-[46px] items-center rounded-tl-[12px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[4px] bg-[#f6f6f6] px-4 py-3"
                        style={{ animation: "chat-row-in 0.4s ease-out both" }}
                      >
                        <p className="font-body text-[15px] text-[#202937]">
                          Hey, I&apos;m R. Dinesh 👋
                        </p>
                      </div>
                    )}

                    {chatStep >= 3 && (
                      <div
                        className="flex min-h-[46px] items-center rounded-tl-[12px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[4px] bg-[#f6f6f6] px-4 py-3"
                        style={{ animation: "chat-row-in 0.4s ease-out both" }}
                      >
                        <p className="font-body text-[15px] text-[#202937]">
                          See what I&apos;ve built. Ask me why.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {chatStep >= 4 && (
                  <div
                    className="flex w-full flex-col items-end gap-1"
                    style={{ animation: "chat-row-in 0.4s ease-out both" }}
                  >
                    <span className="font-body pr-1 text-[12px] font-medium text-[#7a736c]">
                      You
                    </span>
                    <div className="rounded-tl-[16px] rounded-tr-[16px] rounded-bl-[16px] rounded-br-[4px] bg-[#282525] px-4 py-3">
                      <p className="font-body text-[14px] text-white">My work</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {chatStep >= 5 && (
              <div className="flex w-full flex-col gap-5">
                {PROJECT_IMAGES.map((image, i) => (
                  <ProjectCard
                    key={image}
                    image={image}
                    style={{
                      animation: "chat-row-in 0.5s ease-out both",
                      animationDelay: `${i * 150}ms`,
                    }}
                  />
                ))}
              </div>
            )}

            {chatStep >= 6 && (
              <div
                className="flex w-full flex-col gap-[28px]"
                style={{ animation: "chat-row-in 0.5s ease-out both" }}
              >
                <div className="flex w-full items-end gap-3">
                  <div className="relative size-8 shrink-0 overflow-hidden rounded-full border border-[#e5e2dc]">
                    <Image
                      src="/images/hero/profile.png"
                      alt=""
                      fill
                      sizes="32px"
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="flex flex-1 flex-col items-start gap-2">
                    <span className="font-body pl-1 text-[12px] font-medium text-[#7a736c]">
                      Dinesh
                    </span>
                    {chatStep === 6 && (
                      <div className="flex min-h-[46px] items-center gap-1 rounded-tl-[12px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[4px] bg-[#f6f6f6] px-4 py-3">
                        {[0, 150, 300].map((delay) => (
                          <span
                            key={delay}
                            className="size-[6px] rounded-full bg-[#a8a29e]"
                            style={{
                              animation: "typing-bounce 1.2s ease-in-out infinite",
                              animationDelay: `${delay}ms`,
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {chatStep >= 7 && (
                      <div
                        className="flex min-h-[46px] items-center rounded-tl-[12px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[4px] bg-[#f6f6f6] px-4 py-3"
                        style={{ animation: "chat-row-in 0.4s ease-out both" }}
                      >
                        <p className="font-body text-[15px] text-[#202937]">
                          That&apos;s the recent stuff — happy to walk through
                          how I got there.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {chatStep >= 8 && replyThreads.length === 0 && (
                  <div
                    className="flex flex-wrap gap-2 pl-11"
                    style={{ animation: "chat-row-in 0.4s ease-out both" }}
                  >
                    {QUICK_REPLIES.map((label) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => handleReplyClick(label)}
                        className="font-body relative flex h-[35px] items-center rounded-full border border-white/70 bg-white/60 px-4 text-[14px] text-[#202937] shadow-[0px_4px_14px_0px_rgba(30,45,70,0.08)] backdrop-blur-[14px] transition-colors hover:bg-white/80"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}

                {replyThreads.map((label, i) => {
                  const isLast = i === replyThreads.length - 1;
                  const revealed = isLast ? latestRevealed : true;
                  const hasWrap = !!WRAP_MESSAGES[label];
                  const threadWrapStep = isLast
                    ? latestWrapStep
                    : hasWrap
                      ? 2
                      : 0;

                  return (
                    <div
                      key={label}
                      className="flex w-full flex-col gap-[28px]"
                      style={{ animation: "chat-row-in 0.4s ease-out both" }}
                    >
                      <div className="flex w-full flex-col items-end gap-1">
                        <span className="font-body pr-1 text-[12px] font-medium text-[#7a736c]">
                          You
                        </span>
                        <div className="rounded-tl-[16px] rounded-tr-[16px] rounded-bl-[16px] rounded-br-[4px] bg-[#282525] px-4 py-3">
                          <p className="font-body text-[14px] text-white">
                            {label}
                          </p>
                        </div>
                      </div>

                      {QUICK_REPLY_RESPONSES[label] && (
                        <div className="flex w-full items-end gap-3">
                          <div className="relative size-8 shrink-0 overflow-hidden rounded-full border border-[#e5e2dc]">
                            <Image
                              src="/images/hero/profile.png"
                              alt=""
                              fill
                              sizes="32px"
                              className="object-cover object-top"
                            />
                          </div>
                          <div className="flex flex-1 flex-col items-start gap-2">
                            <span className="font-body pl-1 text-[12px] font-medium text-[#7a736c]">
                              Dinesh
                            </span>
                            {!revealed ? (
                              <div className="flex min-h-[46px] items-center gap-1 rounded-tl-[12px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[4px] bg-[#f6f6f6] px-4 py-3">
                                {[0, 150, 300].map((delay) => (
                                  <span
                                    key={delay}
                                    className="size-[6px] rounded-full bg-[#a8a29e]"
                                    style={{
                                      animation:
                                        "typing-bounce 1.2s ease-in-out infinite",
                                      animationDelay: `${delay}ms`,
                                    }}
                                  />
                                ))}
                              </div>
                            ) : (
                              <div className="flex min-h-[46px] items-center rounded-tl-[12px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[4px] bg-[#f6f6f6] px-4 py-3">
                                <p className="font-body text-[15px] text-[#202937]">
                                  {QUICK_REPLY_RESPONSES[label]}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {revealed && label === "About me" && (
                        <AboutMeCard
                          style={{
                            marginTop: 4,
                            animation: "chat-row-in 0.5s ease-out both",
                          }}
                        />
                      )}

                      {revealed && label === "My experience" && (
                        <ExperienceCard
                          style={{
                            marginTop: 4,
                            animation: "chat-row-in 0.5s ease-out both",
                          }}
                        />
                      )}

                      {revealed && label === "What people say" && (
                        <TestimonialsCard
                          style={{
                            marginTop: 4,
                            animation: "chat-row-in 0.5s ease-out both",
                          }}
                        />
                      )}

                      {revealed && label === "Contact" && (
                        <ContactCard
                          style={{
                            marginTop: 4,
                            animation: "chat-row-in 0.5s ease-out both",
                          }}
                        />
                      )}

                      {hasWrap && threadWrapStep >= 1 && (
                        <div className="flex w-full items-end gap-3">
                          <div className="relative size-8 shrink-0 overflow-hidden rounded-full border border-[#e5e2dc]">
                            <Image
                              src="/images/hero/profile.png"
                              alt=""
                              fill
                              sizes="32px"
                              className="object-cover object-top"
                            />
                          </div>
                          <div className="flex flex-1 flex-col items-start gap-2">
                            <span className="font-body pl-1 text-[12px] font-medium text-[#7a736c]">
                              Dinesh
                            </span>
                            {threadWrapStep === 1 && (
                              <div className="flex min-h-[46px] items-center gap-1 rounded-tl-[12px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[4px] bg-[#f6f6f6] px-4 py-3">
                                {[0, 150, 300].map((delay) => (
                                  <span
                                    key={delay}
                                    className="size-[6px] rounded-full bg-[#a8a29e]"
                                    style={{
                                      animation:
                                        "typing-bounce 1.2s ease-in-out infinite",
                                      animationDelay: `${delay}ms`,
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                            {threadWrapStep >= 2 && (
                              <div className="flex min-h-[46px] items-center rounded-tl-[12px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[4px] bg-[#f6f6f6] px-4 py-3">
                                <p className="font-body text-[15px] text-[#202937]">
                                  {WRAP_MESSAGES[label]}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {showFollowUpPills && remainingQuickReplies.length > 0 && (
                  <div
                    className="flex flex-wrap gap-2 pl-11"
                    style={{ animation: "chat-row-in 0.4s ease-out both" }}
                  >
                    {remainingQuickReplies.map((label) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => handleReplyClick(label)}
                        className="font-body relative flex h-[35px] items-center rounded-full border border-white/70 bg-white/60 px-4 text-[14px] text-[#202937] shadow-[0px_4px_14px_0px_rgba(30,45,70,0.08)] backdrop-blur-[14px] transition-colors hover:bg-white/80"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
