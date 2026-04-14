"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { LOCALES } from "@/lib/i18n";

const FLAG: Record<string, string> = {
  en: "EN",
  es: "ES",
  ja: "JA",
  "zh-CN": "简",
  "zh-TW": "繁",
};

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-2.5 py-1.5 text-[12px] tracking-wider text-white/60 hover:text-white border border-white/10 hover:border-white/30 transition-colors font-bold"
      >
        {FLAG[locale]}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 bg-surface border border-white/10 shadow-xl shadow-black/50 z-50 min-w-[140px] animate-scale-in">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              onClick={() => { setLocale(l.code); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm tracking-wider transition-colors flex items-center gap-3 ${
                locale === l.code
                  ? "text-primary bg-white/5"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-[11px] font-bold w-6">{FLAG[l.code]}</span>
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
