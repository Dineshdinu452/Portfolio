"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export function CatMascot({
  className,
  style,
  flipped = false,
  driftAxis = "horizontal",
}: {
  className?: string;
  style?: React.CSSProperties;
  flipped?: boolean;
  driftAxis?: "horizontal" | "vertical";
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  function handleTap() {
    setShowTooltip(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowTooltip(false), 2600);
  }

  return (
    <div className={cn("relative h-[96px] w-[88px]", className)} style={style}>
      <div
        className="relative size-full"
        style={{
          animation:
            driftAxis === "vertical"
              ? "cat-bob 4.2s ease-in-out infinite"
              : "cat-drift 5.2s ease-in-out infinite",
        }}
      >
        {showTooltip && (
          <div
            className="font-body pointer-events-none absolute -top-[42px] left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full border border-white bg-gradient-to-b from-white to-[#f7f7f6] px-4 py-2 text-[12px] font-medium tracking-[-0.01em] text-[#2b3140] shadow-[0_10px_24px_-8px_rgba(0,0,0,0.28),0_1px_2px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.8)] dark:border-white/10 dark:from-[#23262b] dark:to-[#1b1d21] dark:text-white/90"
            style={{ animation: "tooltip-pop 0.3s cubic-bezier(0.16,1,0.3,1)" }}
          >
            <span className="mr-1.5 inline-block size-[6px] rounded-full bg-emerald-400 align-middle" />
            Hi, I&apos;m Dinu&apos;s AI agent
            <div className="absolute left-1/2 top-full -translate-x-1/2">
              <div className="size-[9px] -translate-y-1/2 rotate-45 rounded-[2px] border-b border-r border-white bg-[#f7f7f6] dark:border-white/10 dark:bg-[#1b1d21]" />
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleTap}
          aria-label="Say hi to Dinu"
          className="absolute inset-0 size-full cursor-pointer border-0 bg-transparent p-0"
          style={{ transform: flipped ? "scaleX(-1) rotate(-90deg)" : undefined }}
        >
          <img
            src="/images/hero/cat/aicat-body.svg"
            alt=""
            className="absolute inset-0 size-full"
          />
          <img
            src="/images/hero/cat/aicat-paws.svg"
            alt=""
            className="absolute inset-0 size-full"
            style={{
              transformOrigin: "33% 53%",
              animation: "paw-wave 1.6s ease-in-out infinite",
            }}
          />
          <img
            src="/images/hero/cat/aicat-eyes.svg"
            alt=""
            className="absolute inset-0 size-full"
            style={{
              transformOrigin: "33% 22%",
              animation: "eye-blink 3s ease-in-out infinite",
            }}
          />
          <img
            src="/images/hero/cat/aicat-tail.svg"
            alt=""
            className="absolute inset-0 size-full"
            style={{
              transformOrigin: "58% 57%",
              animation: "tail-wag 1.8s ease-in-out infinite",
              filter: "drop-shadow(1px 1.25px 1.25px rgba(0,0,0,0.18))",
            }}
          />
        </button>
      </div>
    </div>
  );
}
