"use client";

import { ReactNode } from "react";
import { LocaleProvider } from "@/lib/i18n/LocaleContext";
import { ThemeProvider } from "@/lib/ThemeContext";
import { ToastProvider } from "@/lib/ToastContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <ToastProvider>{children}</ToastProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
