"use client";

import Image from "next/image";
import { useState } from "react";

import { GalleryModal } from "./GalleryModal";

const TL_DR_ITEMS = [
  { emoji: "📍", label: "Chennai" },
  { emoji: "☕️", label: "Coffee over tea" },
  { emoji: "🦉", label: "Night owl" },
  { emoji: "🤝", label: "In-person > remote" },
  { emoji: "🥸", label: "Humor: 10/10" },
  { emoji: "📸", label: "Photography" },
];

export function AboutMeCard({ style }: { style?: React.CSSProperties }) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  return (
    <div
      className="relative flex min-h-[592px] w-full flex-col gap-8 rounded-[20px] bg-white px-6 pb-[40px] pt-6 shadow-[0px_2px_4px_0px_rgba(99,152,188,0.06),0px_2px_10px_0px_rgba(190,209,236,0.2)]"
      style={style}
    >
      <div className="flex flex-col-reverse gap-8 sm:flex-row sm:items-start">
        <div className="flex flex-1 flex-col gap-4">
          <h3 className="font-script text-[26px] leading-[34px] text-[#000614]">
            An engineer who kept
            <br />
            finding his{" "}
            <span className="text-[#2a68c2]">way into design.</span>
          </h3>
          <p className="font-body text-sm leading-[23.5px] text-[#6e7a8b]">
            I started with an engineering degree and no traditional design
            background. I taught myself UI and product design, figured
            things out through real projects, and learned a lot the hard
            way.
            <br />
            There were plenty of ups and downs, but each one pushed me to
            get better. I&apos;m still learning every day — asking
            questions, trying things, and becoming a better designer along
            the way.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsGalleryOpen(true)}
          aria-label="Open photo gallery"
          className="group relative mx-auto h-[334px] w-[239px] shrink-0 cursor-pointer border-0 bg-transparent p-0 sm:mx-0"
        >
          <Image
            src="/images/gallerybg.png"
            alt=""
            fill
            sizes="239px"
            className="rounded-[16px] object-cover"
          />
          <div className="absolute left-[111px] top-[141px] h-[222px] w-[191px] -translate-x-1/2 -translate-y-1/2 rotate-[-2.46deg] transition-transform duration-300 ease-out group-hover:rotate-[-4.5deg]">
            <Image
              src="/images/pic2.png"
              alt=""
              fill
              sizes="191px"
              className="object-contain"
            />
          </div>
          <div className="absolute left-[120px] top-[140px] h-[222px] w-[191px] -translate-x-1/2 -translate-y-1/2 rotate-[4.29deg] transition-transform duration-300 ease-out group-hover:rotate-[6.5deg]">
            <Image
              src="/images/pic1.png"
              alt="Dinesh outside of work"
              fill
              sizes="191px"
              className="object-contain"
            />
          </div>
          <img
            src="/images/purple-pin.svg"
            alt=""
            className="absolute left-[107px] top-[4px] h-[34px] w-[18px] rotate-[2.71deg] drop-shadow-[1px_2px_2px_rgba(0,0,0,0.3)]"
          />
          <img
            src="/images/lifeoutsidefigambutton.svg"
            alt=""
            className="absolute left-[59px] top-[281px] h-[42px] w-[117px]"
          />
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="font-body shrink-0 text-sm text-[#6e7a8b]">
            TL;DR
          </span>
          <div className="h-px flex-1 bg-[rgba(16,32,56,0.08)]" />
        </div>
        <div className="flex flex-wrap gap-2">
          {TL_DR_ITEMS.map((item) => (
            <div
              key={item.label}
              className="font-body relative flex h-[35px] items-center gap-1.5 rounded-full border border-white/70 bg-white/60 px-4 text-[14px] text-[#202937] shadow-[0px_4px_14px_0px_rgba(30,45,70,0.08)] backdrop-blur-[14px]"
            >
              <span>{item.emoji}</span>
              <span>{item.label}</span>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.9)]"
              />
            </div>
          ))}
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_-3px_2px_0px_#dde1e3,inset_0px_0px_2px_0px_#c4cddb,inset_0px_1px_2px_0px_white]"
      />

      <GalleryModal
        open={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      />
    </div>
  );
}
