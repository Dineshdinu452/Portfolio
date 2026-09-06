"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export function ThemeToggle({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const dark = stored ? stored === "dark" : prefersDark;
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  const iconColor = isDark ? "#F5F5F4" : "#202937";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "flex size-10 items-center justify-center rounded-full border border-[#c5c3c1] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.15)] dark:border-white/25",
        className
      )}
      style={style}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        {isDark ? (
          <path
            transform="translate(1.8 1.8) scale(0.6)"
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            fill="none"
            stroke={iconColor}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <>
            <path
              d="M9 12C10.6569 12 12 10.6569 12 9C12 7.34315 10.6569 6 9 6C7.34315 6 6 7.34315 6 9C6 10.6569 7.34315 12 9 12Z"
              stroke={iconColor}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 1.5V3M9 15V16.5M3.6975 3.6975L4.755 4.755M13.245 13.245L14.3025 14.3025M1.5 9H3M15 9H16.5M4.755 13.245L3.6975 14.3025M14.3025 3.6975L13.245 4.755"
              stroke={iconColor}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}
      </svg>
    </button>
  );
}
