import Image from "next/image";

const STATS = [
  { value: "+19%", label: "Discovery to booking" },
  { value: "−27%", label: "Support queries" },
  { value: "−14%", label: "Bounce rate" },
];

export function ProjectCard({
  image,
  style,
}: {
  image: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-[20px] bg-white shadow-[0px_2px_4px_0px_rgba(99,152,188,0.06),0px_2px_10px_0px_rgba(190,209,236,0.2)]"
      style={style}
    >
      <div className="relative h-[260px] w-full">
        <Image
          src={image}
          alt=""
          fill
          sizes="636px"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-4 px-7 pt-6 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline gap-3">
            <p className="font-body text-2xl font-medium leading-[30px] tracking-[-0.4px] text-[#10161f]">
              App revamp
            </p>
            <p className="font-body text-[11px] uppercase tracking-[1.98px] text-[#97a3b6]">
              Surveysparrow
            </p>
          </div>
          <p className="font-body text-sm tracking-[-0.05px] text-[#4c5768]">
            Mobile app homepage revamp
          </p>
        </div>
        <p className="font-body text-sm leading-[23.5px] text-[#6e7a8b]">
          A homepage redesign aimed at shortening the path to trip discovery
          and booking. Part of a wider shift at Pickyourtrail from designing
          screens to&hellip;
        </p>
        <div className="flex gap-6 border-t border-[rgba(16,32,56,0.08)] pt-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <span className="font-body text-[22px] text-[#5c74c9]">
                {stat.value}
              </span>
              <span className="font-manrope mt-1 text-[11.5px] text-[#97a3b6]">
                {stat.label}
              </span>
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
