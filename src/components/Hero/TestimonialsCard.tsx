"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type CardId = "1" | "2" | "3";
type Position = "center" | "left" | "right";

const CARD_IDS: CardId[] = ["1", "2", "3"];

const INITIAL_POSITIONS: Record<CardId, Position> = {
  "1": "center",
  "2": "left",
  "3": "right",
};

const CARD_WIDTH = 280;
const CARD_HEIGHT = 310;

const POSITION_VARIANTS: Record<
  Position,
  {
    x: number;
    y: number;
    scale: number;
    rotate: number;
    opacity: number;
    zIndex: number;
  }
> = {
  center: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1, zIndex: 30 },
  left: { x: -83, y: 24, scale: 0.9, rotate: -11, opacity: 0.85, zIndex: 10 },
  right: { x: 102, y: 19, scale: 0.9, rotate: 9, opacity: 0.85, zIndex: 20 },
};

const SPRING = {
  type: "spring" as const,
  stiffness: 260,
  damping: 26,
  mass: 0.9,
};

const AUTO_ADVANCE_MS = 5000;

// Container width at which cards render at their natural (Figma) size; below
// that, width/height and offsets scale down together so the side cards never
// overflow the row, down to a floor so they stay legible.
const LAYOUT_NATURAL_WIDTH = 500;
const LAYOUT_MIN_SCALE = 0.6;

function useLayoutScale(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function measure() {
      const width = el!.getBoundingClientRect().width;
      setScale(
        Math.min(1, Math.max(LAYOUT_MIN_SCALE, width / LAYOUT_NATURAL_WIDTH))
      );
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [containerRef]);

  return scale;
}

function TestimonialSlide({
  id,
  position,
  scale,
  visible,
  onSelect,
}: {
  id: CardId;
  position: Position;
  scale: number;
  visible: boolean;
  onSelect: () => void;
}) {
  const variant = POSITION_VARIANTS[position];
  const isCenter = position === "center";
  const image = `/images/testimonials/${id}-${isCenter ? "default" : "blurred"}.png`;
  const [parallax, setParallax] = useState({ x: 0, y: 0, rotate: 0 });

  const baseX = variant.x * scale;
  const baseY = variant.y * scale;
  const baseRotate = variant.rotate * scale;

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    if (!isCenter) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setParallax({ x: px * 2.5, y: py * 1.5, rotate: px * 0.6 });
  }

  function handleMouseLeave() {
    if (isCenter) setParallax({ x: 0, y: 0, rotate: 0 });
  }

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label={
        isCenter
          ? "Current testimonial"
          : `Bring testimonial ${id} to the front`
      }
      className="absolute overflow-hidden rounded-[4px] border-0 p-0"
      style={{
        width: CARD_WIDTH * scale,
        height: CARD_HEIGHT * scale,
        cursor: isCenter ? "default" : "pointer",
        pointerEvents: visible ? "auto" : "none",
        boxShadow: isCenter
          ? "0px 14px 34px -8px rgba(0,0,0,0.3)"
          : "0px 8px 20px -6px rgba(0,0,0,0.25)",
      }}
      animate={{
        x: baseX + parallax.x,
        y: baseY + parallax.y,
        scale: variant.scale,
        rotate: baseRotate + parallax.rotate,
        opacity: visible ? variant.opacity : 0,
        zIndex: variant.zIndex,
      }}
      whileHover={
        isCenter
          ? undefined
          : {
              x: baseX * 0.96,
              y: baseY * 0.96,
              rotate: baseRotate * 0.92,
              scale: variant.scale + 0.01,
            }
      }
      whileTap={isCenter ? undefined : { scale: variant.scale * 0.95 }}
      transition={{
        ...SPRING,
        opacity: { duration: 0.9, ease: "easeOut" },
      }}
    >
      <Image
        src={image}
        alt={
          isCenter
            ? "Testimonial from Anand, Senior Design Director at Surveysparrow"
            : ""
        }
        fill
        sizes="(max-width: 640px) 60vw, 280px"
        className="object-cover"
      />
    </motion.button>
  );
}

export function TestimonialsCard({ style }: { style?: React.CSSProperties }) {
  const [positions, setPositions] =
    useState<Record<CardId, Position>>(INITIAL_POSITIONS);
  const [isHovering, setIsHovering] = useState(false);
  const [backCardsRevealed, setBackCardsRevealed] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const scale = useLayoutScale(rowRef);

  useEffect(() => {
    const timer = setTimeout(() => setBackCardsRevealed(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  function rotateToCenter(fromPosition: "left" | "right") {
    setPositions((prev) => {
      const next = {} as Record<CardId, Position>;
      for (const id of CARD_IDS) {
        const pos = prev[id];
        if (fromPosition === "left") {
          next[id] =
            pos === "left" ? "center" : pos === "center" ? "right" : "left";
        } else {
          next[id] =
            pos === "right" ? "center" : pos === "center" ? "left" : "right";
        }
      }
      return next;
    });
  }

  useEffect(() => {
    if (isHovering || !backCardsRevealed) return;
    const timer = setInterval(() => {
      rotateToCenter("right");
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [isHovering, backCardsRevealed]);

  return (
    <div
      className="relative flex w-full flex-col items-center gap-8 rounded-[20px] bg-white px-6 pb-[80px] pt-6 shadow-[0px_2px_4px_0px_rgba(99,152,188,0.06),0px_2px_10px_0px_rgba(190,209,236,0.2)]"
      style={style}
    >
      <h3 className="font-script w-full text-[26px] leading-[34px] text-[#000614]">
        Not my words.{" "}
        <span className="text-[#2a68c2]">What people say..</span>
      </h3>

      <div
        ref={rowRef}
        className="relative flex h-[360px] w-full items-center justify-center"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {CARD_IDS.map((id) => {
          const position = positions[id];
          return (
            <TestimonialSlide
              key={id}
              id={id}
              position={position}
              scale={scale}
              visible={position === "center" || backCardsRevealed}
              onSelect={() => {
                if (position === "left") rotateToCenter("left");
                if (position === "right") rotateToCenter("right");
              }}
            />
          );
        })}
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_-3px_2px_0px_#dde1e3,inset_0px_0px_2px_0px_#c4cddb,inset_0px_1px_2px_0px_white]"
      />
    </div>
  );
}
