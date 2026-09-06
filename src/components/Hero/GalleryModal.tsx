"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const MASONRY_COLUMNS = [
  [
    { src: "/images/gallery/1.png", height: 280 },
    { src: "/images/gallery/2.png", height: 180 },
    { src: "/images/gallery/3.png", height: 200 },
    { src: "/images/gallery/10.png", height: 220 },
    { src: "/images/gallery/11.png", height: 190 },
    { src: "/images/gallery/12.png", height: 240 },
    { src: "/images/gallery/13.png", height: 170 },
  ],
  [
    { src: "/images/gallery/4.png", height: 180 },
    { src: "/images/gallery/9.png", height: 280 },
    { src: "/images/gallery/5.png", height: 200 },
    { src: "/images/gallery/14.png", height: 210 },
    { src: "/images/gallery/15.png", height: 230 },
    { src: "/images/gallery/16.png", height: 190 },
  ],
  [
    { src: "/images/gallery/6.png", height: 240 },
    { src: "/images/gallery/7.png", height: 160 },
    { src: "/images/gallery/8.png", height: 260 },
    { src: "/images/gallery/17.png", height: 200 },
    { src: "/images/gallery/18.png", height: 220 },
    { src: "/images/gallery/19.png", height: 180 },
  ],
];

function MasonryPhoto({ src, height }: { src: string; height: number }) {
  const [failed, setFailed] = useState(false);
  const [transform, setTransform] = useState("translate(0px, 0px) scale(1)");

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const maxShift = 6;
    setTransform(
      `translate(${-x * maxShift * 2}px, ${-y * maxShift * 2}px) scale(1.05)`
    );
  }

  function handleMouseLeave() {
    setTransform("translate(0px, 0px) scale(1)");
  }

  return (
    <div
      className="relative h-[calc(var(--photo-h)*0.6)] w-full shrink-0 overflow-hidden rounded-[10px] sm:h-[var(--photo-h)]"
      style={{ "--photo-h": `${height}px` } as React.CSSProperties}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {!failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          className="absolute inset-0 size-full object-cover transition-transform duration-200 ease-out"
          style={{ transform }}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[#eef1f5] font-body text-[11px] text-[#9aa3b2]">
          Add photo
        </div>
      )}
    </div>
  );
}

export function GalleryModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 sm:p-8"
      onClick={onClose}
      style={{ animation: "chat-row-in 0.25s ease-out both" }}
    >
      <div
        className="relative z-10 flex max-h-[85vh] w-full max-w-[828px] flex-col overflow-hidden rounded-[26px] bg-white/90 shadow-[0px_50px_120px_0px_rgba(0,0,0,0.3)] backdrop-blur-[30px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="no-scrollbar flex flex-col gap-6 overflow-y-auto px-6 pb-6 pt-8"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 140px 90px at 15% 8%, rgba(153,210,255,0.28), rgba(153,210,255,0) 70%), radial-gradient(ellipse 140px 90px at 88% 78%, rgba(255,180,140,0.26), rgba(255,180,140,0) 70%)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <p className="font-body text-[27px] tracking-[-0.6px] text-black">
                Happy gallery
              </p>
              <p className="font-body text-[12.5px] font-medium text-[#8a8a8a]">
                Life outside figma
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close gallery"
              className="relative flex h-[31px] w-[34px] items-center justify-center rounded-[24px] border border-white/70 shadow-[0px_4px_14px_0px_rgba(30,45,70,0.08)]"
            >
              <div
                aria-hidden
                className="absolute inset-0 rounded-[24px] bg-white/60 backdrop-blur-[14px]"
              />
              <span className="relative font-body text-[17px] text-[#6f6f6f]">
                ×
              </span>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.9)]"
              />
            </button>
          </div>

          <div className="flex gap-3">
            {MASONRY_COLUMNS.map((column, i) => (
              <div key={i} className="flex flex-1 flex-col gap-3">
                {column.map((photo) => (
                  <MasonryPhoto
                    key={photo.src}
                    src={photo.src}
                    height={photo.height}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
