import type { Locale } from "@shared/courseContent";
import { createContext, useContext, useEffect, useState } from "react";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);
const STORAGE_KEY = "ux-academy-locale";

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => (localStorage.getItem(STORAGE_KEY) as Locale) || "es");
  const setLocale = (next: Locale) => setLocaleState(next);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale === "pt" ? "pt-BR" : locale;
  }, [locale]);

  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used inside LocaleProvider");
  return context;
}
