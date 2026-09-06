import Image from "next/image";

import { cn } from "@/lib/utils";

const JOBS = [
  {
    title: "Product Designer",
    company: "Surveysparrow",
    period: "2024 Mar  →  Present",
  },
  {
    title: "UIUX Design Intern",
    company: "Talksite.pvt.ltd",
    period: "2023 Feb  →  2023 Aug",
  },
  {
    title: "UI Intern",
    company: "Siemens",
    period: "2022 Mar  →  2022 Aug",
  },
];

const AWARDS = [
  {
    eyebrow: "What I work in",
    description:
      "Most of my recent work is designed and built in Claude Design my recent work is designed",
    image: "/images/experience/award-1.png",
  },
  {
    eyebrow: "What I work in",
    description:
      "Most of my recent work is designed and built in Claude Design my recent work is designed",
    image: "/images/experience/award-1.png",
  },
];

export function ExperienceCard({ style }: { style?: React.CSSProperties }) {
  return (
    <div
      className="relative flex w-full max-w-[652px] flex-col gap-7 rounded-[20px] bg-white p-4 shadow-[0px_2px_4px_0px_rgba(99,152,188,0.06),0px_2px_10px_0px_rgba(190,209,236,0.2)] sm:p-6"
      style={style}
    >
      <div className="flex flex-col gap-5">
        <p className="font-body text-sm leading-[23.5px] text-[#6e7a8b]">
          I started with an engineering degree and no traditional design
          background. I taught myself UI and product design, figured things
          out through real projects, and learned a lot the hard way.
        </p>

        <div className="flex flex-col pt-[3px]">
          {JOBS.map((job, i) => (
            <div
              key={job.title}
              className={cn(
                "flex flex-col gap-1 pb-4 sm:flex-row sm:items-start sm:gap-4",
                i !== 0 && "pt-4",
                i !== JOBS.length - 1 &&
                  "border-b border-dashed border-[#cbced4]"
              )}
            >
              <div className="flex items-baseline justify-between gap-3 sm:w-[170px] sm:shrink-0 sm:block">
                <p className="font-body whitespace-nowrap text-sm font-medium tracking-[-0.42px] text-black">
                  {job.title}
                </p>
                <p className="font-body shrink-0 whitespace-nowrap text-xs text-[#8b8f98] sm:hidden">
                  {job.period}
                </p>
              </div>
              <p className="font-body text-sm tracking-[-0.42px] text-[#4d4d54] sm:flex-1 sm:whitespace-nowrap sm:pr-12 sm:text-center">
                {job.company}
              </p>
              <p className="font-body hidden shrink-0 whitespace-nowrap text-sm tracking-[-0.42px] text-[#4d4d54] sm:block">
                {job.period}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <span className="font-body shrink-0 text-sm text-[#6e7a8b]">
            Awards
          </span>
          <div className="h-px flex-1 bg-[rgba(16,32,56,0.08)]" />
        </div>

        <div className="flex flex-col gap-5">
          {AWARDS.map((award, i) => (
            <div
              key={i}
              className="flex w-full flex-col-reverse items-start gap-4 rounded-[20px] border border-[#f0f0f0] bg-[#f2f2f2]/80 px-[18px] py-4 sm:flex-row sm:justify-between"
            >
              <div className="flex min-w-0 flex-col items-start">
                <p className="font-manrope text-[9.5px] uppercase tracking-[1.615px] text-[#696565]">
                  {award.eyebrow}
                </p>
                <div className="w-full max-w-[306px] pt-[14px]">
                  <p className="font-body text-sm leading-[23.52px] text-[#3f454c]">
                    {award.description}
                  </p>
                </div>
              </div>
              <div className="relative h-[100px] w-full shrink-0 overflow-hidden rounded-[16px] bg-[#e4dfdf] sm:h-[113.08px] sm:w-[181.38px]">
                {award.image && (
                  <Image
                    src={award.image}
                    alt="Star of the Quarter award, 2025, Surveysparrow"
                    fill
                    sizes="(max-width: 640px) 100vw, 182px"
                    className="object-cover"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_-3px_2px_0px_#dde1e3,inset_0px_0px_2px_0px_#c4cddb,inset_0px_1px_2px_0px_white]"
      />
    </div>
  );
}
