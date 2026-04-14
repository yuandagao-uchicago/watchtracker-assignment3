import type { Dictionary } from "./en";

export type Locale = "en" | "es" | "ja" | "zh-CN" | "zh-TW";

export const LOCALES: { code: Locale; label: string }[] = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "ja", label: "日本語" },
  { code: "zh-CN", label: "简体中文" },
  { code: "zh-TW", label: "繁體中文" },
];

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./en").then((m) => m.default),
  es: () => import("./es").then((m) => m.default),
  ja: () => import("./ja").then((m) => m.default),
  "zh-CN": () => import("./zh-CN").then((m) => m.default),
  "zh-TW": () => import("./zh-TW").then((m) => m.default),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}

export type { Dictionary };
