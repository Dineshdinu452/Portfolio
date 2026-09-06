"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const CARD_WIDTH = 250;
const CARD_HEIGHT = 152;
const SLOT_WIDTH = 264;
const SLOT_HEIGHT = 165;

const CONTACTS = [
  {
    key: "email",
    image: "/icons/contact/cards/email.svg",
    rotate: -1.47,
    href: "mailto:dinu8220001@gmail.com",
    copyValue: undefined as string | undefined,
  },
  {
    key: "phone",
    image: "/icons/contact/cards/phone.svg",
    rotate: 1.7,
    href: undefined as string | undefined,
    copyValue: "+918220545406",
  },
  {
    key: "resume",
    image: "/icons/contact/cards/resume.svg",
    rotate: -2.44,
    href: "/resume.pdf",
    copyValue: undefined as string | undefined,
  },
  {
    key: "linkedin",
    image: "/icons/contact/cards/linkedin.svg",
    rotate: 1.83,
    href: "https://www.linkedin.com/in/dineshkumar18001/",
    copyValue: undefined as string | undefined,
  },
];

type Contact = (typeof CONTACTS)[number];

function ContactTileImage({ contact }: { contact: Contact }) {
  return (
    <motion.img
      src={contact.image}
      alt=""
      width={CARD_WIDTH}
      height={CARD_HEIGHT}
      className="h-auto rounded-[24px] object-cover shadow-[0px_14px_34px_-8px_rgba(0,0,0,0.25)]"
      style={{
        width: `${(CARD_WIDTH / SLOT_WIDTH) * 100}%`,
        aspectRatio: `${CARD_WIDTH} / ${CARD_HEIGHT}`,
      }}
      initial={false}
      animate={{ rotate: contact.rotate, scale: 1 }}
      whileHover={{ rotate: contact.rotate * 0.85, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    />
  );
}

function ContactTile({ contact }: { contact: Contact }) {
  const [copied, setCopied] = useState(false);

  if (contact.copyValue) {
    return (
      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText(contact.copyValue!);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="relative flex w-full items-center justify-center border-0 bg-transparent p-0"
        style={{
          maxWidth: SLOT_WIDTH,
          aspectRatio: `${SLOT_WIDTH} / ${SLOT_HEIGHT}`,
        }}
      >
        <ContactTileImage contact={contact} />
        {copied && (
          <span
            className="font-body pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/80 px-3 py-1.5 text-[13px] text-white"
            style={{ animation: "chat-row-in 0.2s ease-out both" }}
          >
            Copied!
          </span>
        )}
      </button>
    );
  }

  return (
    <a
      href={contact.href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-full items-center justify-center"
      style={{
        maxWidth: SLOT_WIDTH,
        aspectRatio: `${SLOT_WIDTH} / ${SLOT_HEIGHT}`,
      }}
    >
      <ContactTileImage contact={contact} />
    </a>
  );
}

export function ContactCard({ style }: { style?: React.CSSProperties }) {
  return (
    <div
      className="relative flex w-full flex-col gap-8 rounded-[20px] bg-white px-6 pb-8 pt-6 shadow-[0px_2px_4px_0px_rgba(99,152,188,0.06),0px_2px_10px_0px_rgba(190,209,236,0.2)]"
      style={style}
    >
      <h3 className="font-script w-full text-[26px] leading-[34px] text-[#000614]">
        Let&apos;s connect.
      </h3>

      <div className="grid grid-cols-2 gap-x-5 gap-y-4">
        {CONTACTS.map((contact) => (
          <ContactTile key={contact.key} contact={contact} />
        ))}
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_-3px_2px_0px_#dde1e3,inset_0px_0px_2px_0px_#c4cddb,inset_0px_1px_2px_0px_white]"
      />
    </div>
  );
}
