"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Dictionary } from "./en";
import { Locale, getDictionary } from "./index";
import enDict from "./en";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: "en",
  setLocale: () => {},
  t: enDict,
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [dict, setDict] = useState<Dictionary>(enDict);

  // Load saved locale from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved && ["en", "es", "ja", "zh-CN", "zh-TW"].includes(saved)) {
      setLocaleState(saved);
      getDictionary(saved).then(setDict);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
    document.documentElement.lang = newLocale;
    getDictionary(newLocale).then(setDict);
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: dict }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
