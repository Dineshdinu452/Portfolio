"use client";

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type Variants,
} from "framer-motion";
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
const CAT_END_BOTTOM_OVERHANG = 5;
const CAT_BOTTOM_THRESHOLD = 0.95;

// Auto-follow tuning: how close to the bottom counts as "at bottom", and how
// much upward movement counts as deliberate (vs. sub-pixel scroll noise).
const AUTO_SCROLL_BOTTOM_THRESHOLD = 80;
const AUTO_SCROLL_UP_EPSILON = 4;

// Draggable card width, resized via the bezel-bar handles. MAX intentionally
// exceeds any realistic viewport — CSS max-w-full on the card is what
// actually stops it, so dragging wide just previews the layout at whatever
// width the screen can give it.
const DEFAULT_CARD_WIDTH = 700;
const MIN_CARD_WIDTH = 375;
const MAX_CARD_WIDTH = 1440;

const PROJECT_IMAGES = [
  "/images/project1bg.png",
  "/images/project2bg.png",
  "/images/project3bg.png",
];

const QUICK_REPLIES = [
  "About me",
  "My experience",
  "What people say",
  "Contact",
];

const QUICK_REPLY_RESPONSES: Record<string, string> = {
  "About me": "Happy to share more than the resume version:",
  "My experience": "Here's where I've been:",
};

const WRAP_MESSAGES: Record<string, string> = {
  "About me":
    "Holla !! That's a wrap on me. Dig into my experience, hear the receipts, or hit me up directly.",
  "My experience":
    "Mostly B2B SaaS, dashboards, workflows, and the unglamorous-but-critical screens people live in every day.",
  "What people say": "Want to talk to me? Happy to connect you.",
};

// Chat progression: 0 idle, 1 typing, 2 msg1, 3 msg2, 4 "My work" reply,
// 5 project cards, 6 closing typing, 7 closing message, 8 quick-reply pills.
const CHAT_STEP_DELAYS = [3300, 4000, 4500, 5200, 6100, 8100, 9100, 9800];

const EASE_PREMIUM = [0.16, 1, 0.3, 1] as const;

const CLOSING_CONTAINER_VARIANTS: Variants = {
  hidden: {},
  visible: {},
};

const ATMOSPHERE_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const FOOTER_LINE_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

function VibeCodedText() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  return (
    <motion.span
      className="relative inline-block cursor-default text-[#2a68c2]"
      animate={{ x: offset.x, y: offset.y, scale: isHovering ? 1.04 : 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setOffset({
          x: (event.clientX - rect.left - rect.width / 2) * 0.25,
          y: (event.clientY - rect.top - rect.height / 2) * 0.25,
        });
      }}
      onMouseLeave={() => {
        setIsHovering(false);
        setOffset({ x: 0, y: 0 });
      }}
    >
      Happily vibe coded
      <motion.span
        aria-hidden
        className="absolute inset-x-0 -bottom-0.5 h-px origin-left bg-[#2a68c2]"
        animate={{ scaleX: isHovering ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
    </motion.span>
  );
}

// Closing-moment sequence: 0 idle (not yet in view), 1 atmosphere + line
// revealed, 2 signature drawing, 3 settled (arrow float enabled).
function ClosingMoment() {
  const reduceMotion = !!useReducedMotion();
  const [stage, setStage] = useState<0 | 1 | 2 | 3>(() =>
    reduceMotion ? 3 : 0
  );

  const revealProgress = useMotionValue(reduceMotion ? 100 : 0);
  const signatureBlur = useMotionValue(reduceMotion ? 0 : 6);
  const signatureMask = useTransform(
    revealProgress,
    (value) =>
      `linear-gradient(90deg, black 0%, black ${value}%, transparent ${Math.min(
        value + 14,
        100
      )}%)`
  );
  const signatureFilter = useTransform(signatureBlur, (value) => `blur(${value}px)`);

  useEffect(() => {
    if (stage !== 2 || reduceMotion) return;
    const maskAnimation = animate(revealProgress, 100, {
      duration: 1.3,
      ease: [0.65, 0, 0.35, 1],
    });
    const blurAnimation = animate(signatureBlur, 0, {
      duration: 1.3,
      ease: "easeOut",
      onComplete: () => setStage(3),
    });
    return () => {
      maskAnimation.stop();
      blurAnimation.stop();
    };
  }, [stage, reduceMotion, revealProgress, signatureBlur]);

  return (
    <div className="relative flex w-full flex-col items-center gap-[40px]">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 100%, rgba(196,219,224,0.35) 0%, rgba(240,246,244,0) 70%)",
        }}
        initial="hidden"
        animate={stage >= 1 ? "visible" : "hidden"}
        variants={ATMOSPHERE_VARIANTS}
        transition={{ duration: reduceMotion ? 0 : 1.6, ease: EASE_PREMIUM }}
      />

      <motion.button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className="relative flex h-[40px] w-[40px] items-center justify-center rounded-full border border-white/72 shadow-[0px_4px_14px_0px_rgba(30,45,70,0.08)] backdrop-blur-[14px]"
        style={{ backgroundColor: "rgba(255,255,255,0.58)" }}
        animate={
          stage >= 3 && !reduceMotion ? { y: [0, -4, 0] } : { y: 0 }
        }
        transition={
          stage >= 3 && !reduceMotion
            ? { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.3 }
        }
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.9)]"
        />
        <Image src="/icons/scroll-top-arrow.svg" alt="" width={20} height={20} />
      </motion.button>

      <motion.div
        className="flex flex-col items-center gap-[20px] text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={CLOSING_CONTAINER_VARIANTS}
        onViewportEnter={() =>
          setStage((current) => (current === 0 ? 1 : current))
        }
      >
        <motion.p
          initial="hidden"
          animate={stage >= 1 ? "visible" : "hidden"}
          variants={FOOTER_LINE_VARIANTS}
          transition={{ duration: reduceMotion ? 0 : 0.5, ease: EASE_PREMIUM }}
          className="font-body text-[18px] leading-[34px] text-[#000614]"
          onAnimationComplete={() =>
            setStage((current) => (current === 1 ? 2 : current))
          }
        >
          Lovingly designed. <VibeCodedText />
        </motion.p>

        <motion.p
          className="font-signature text-[48px] leading-normal text-[#625b5b]"
          style={{
            WebkitMaskImage: signatureMask,
            maskImage: signatureMask,
            filter: signatureFilter,
          }}
        >
          Dinesh
        </motion.p>
      </motion.div>
    </div>
  );
}

// Device-bezel bar (like a phone's side buttons) that fades in when the hero
// frame is hovered and doubles as a drag handle to resize the card's width —
// fixed to the viewport (not the card) so it stays put while the page
// scrolls. Its own position tracks the live cardWidth, since dragging can
// move the card's edges anywhere between MIN_CARD_WIDTH and MAX_CARD_WIDTH.
function DeviceBezelBar({
  side,
  visible,
  cardWidth,
  onResizeStart,
}: {
  side: "left" | "right";
  visible: boolean;
  cardWidth: number;
  onResizeStart: (side: "left" | "right", event: React.PointerEvent) => void;
}) {
  const halfWidth = cardWidth / 2;
  const left =
    side === "left"
      ? `calc(50% - ${halfWidth + 24}px)`
      : `calc(50% + ${halfWidth + 12}px)`;

  return (
    <motion.div
      role="slider"
      aria-label={`Resize hero card from the ${side}`}
      aria-valuemin={MIN_CARD_WIDTH}
      aria-valuemax={MAX_CARD_WIDTH}
      aria-valuenow={Math.round(cardWidth)}
      onPointerDown={(event) => onResizeStart(side, event)}
      className="fixed top-[256px] z-30 hidden cursor-ew-resize touch-none flex-col items-center justify-center gap-[6px] rounded-full border border-white/15 bg-[rgba(13,13,13,0.5)] shadow-[0px_0px_0px_1px_rgba(255,255,255,0.18),0px_0px_20px_0px_rgba(255,255,255,0.18)] backdrop-blur-[8px] min-[800px]:flex"
      style={{
        width: 12,
        height: 160,
        left,
        pointerEvents: visible ? "auto" : "none",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 1.04 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {Array.from({ length: 3 }).map((_, i) => (
        <span
          key={i}
          className="size-[4px] shrink-0 rounded-full bg-white/75"
        />
      ))}
    </motion.div>
  );
}

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
  const [isFrameHovering, setIsFrameHovering] = useState(false);
  const [isResizingFrame, setIsResizingFrame] = useState(false);
  const [cardWidth, setCardWidth] = useState(DEFAULT_CARD_WIDTH);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const autoFollowRef = useRef(true);
  const lastScrollYRef = useRef(0);

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
    if (!autoFollowRef.current) return;
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  }, [showDivider, chatStep, replyThreads, latestRevealed, latestWrapStep]);

  useEffect(() => {
    if (chatStep < 4) return;
    const el = contentRef.current;
    if (el) setCardHeight(el.scrollHeight);
  }, [chatStep, replyThreads, latestRevealed, latestWrapStep, cardWidth]);

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
      if (!autoFollowRef.current) return;
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

      const currentY = window.scrollY;
      const distanceFromBottom = maxScroll - currentY;
      if (distanceFromBottom <= AUTO_SCROLL_BOTTOM_THRESHOLD) {
        autoFollowRef.current = true;
      } else if (currentY < lastScrollYRef.current - AUTO_SCROLL_UP_EPSILON) {
        // Programmatic auto-scroll only ever moves scrollY toward the
        // bottom, so any observed upward movement is genuine user intent.
        autoFollowRef.current = false;
      }
      lastScrollYRef.current = currentY;

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

  function handleResizeStart(
    side: "left" | "right",
    event: React.PointerEvent
  ) {
    event.preventDefault();
    const handle = event.currentTarget as HTMLElement;
    handle.setPointerCapture(event.pointerId);

    const startX = event.clientX;
    const startWidth = cardWidth;
    const previousUserSelect = document.body.style.userSelect;
    document.body.style.userSelect = "none";
    setIsResizingFrame(true);

    function handleMove(moveEvent: PointerEvent) {
      const deltaX = moveEvent.clientX - startX;
      const widthDelta = side === "right" ? deltaX * 2 : -deltaX * 2;
      setCardWidth(
        Math.min(
          MAX_CARD_WIDTH,
          Math.max(MIN_CARD_WIDTH, startWidth + widthDelta)
        )
      );
    }

    function handleUp() {
      setIsResizingFrame(false);
      document.body.style.userSelect = previousUserSelect;
      handle.removeEventListener("pointermove", handleMove);
      handle.removeEventListener("pointerup", handleUp);
    }

    handle.addEventListener("pointermove", handleMove);
    handle.addEventListener("pointerup", handleUp);
  }

  const isChatting = chatStep >= 1;
  const profile = isChatting ? PROFILE_SMALL : PROFILE_BIG;
  const bgScale = 1 + scrollProgress * 0.1;
  const isCatAtBottom = scrollProgress >= CAT_BOTTOM_THRESHOLD;
  // Anchored to the container's own edges (not a hardcoded card width), so it
  // tracks the container's real size instead of assuming a fixed layout.
  const catPosition: React.CSSProperties = isCatAtBottom
    ? { right: "var(--cat-right-inset)", bottom: CAT_END_BOTTOM_OVERHANG }
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

      <div
        className="relative z-10 max-w-full [--cat-right-inset:-16px] sm:[--cat-right-inset:-55px]"
        style={{ width: cardWidth }}
      >
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

        <DeviceBezelBar
          side="left"
          visible={isFrameHovering || isResizingFrame}
          cardWidth={cardWidth}
          onResizeStart={handleResizeStart}
        />
        <DeviceBezelBar
          side="right"
          visible={isFrameHovering || isResizingFrame}
          cardWidth={cardWidth}
          onResizeStart={handleResizeStart}
        />

        <div
          ref={cardRef}
          onMouseEnter={() => setIsFrameHovering(true)}
          onMouseLeave={() => setIsFrameHovering(false)}
          className="relative max-w-full overflow-hidden rounded-[20px] border border-white/60 bg-white/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          style={{
            width: cardWidth,
            height: cardHeight,
            transition: isResizingFrame
              ? "none"
              : "height 0.6s cubic-bezier(0.16,1,0.3,1)",
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
            className="flex w-full flex-col items-center gap-[20px] px-6 pb-[100px] pt-6 sm:px-8 sm:pt-8"
          >
            {showContent && (
              <div
                className="relative shrink-0 overflow-hidden border-[#e5e2dc]"
                style={{
                  width: `min(${profile.size}px, 76vw)`,
                  height: `min(${profile.size}px, 76vw)`,
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

                {showFollowUpPills && remainingQuickReplies.length === 0 && (
                  <ClosingMoment />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
