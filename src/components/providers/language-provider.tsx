"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { APP_LANGUAGES } from "@/lib/constants";
import { dictionary } from "@/lib/translations";
import type { AppLanguage } from "@/lib/types";

type LanguageContextValue = {
  language: AppLanguage;
  locale: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  setLocale: (language: AppLanguage) => void;
  t: typeof dictionary.en;
};

const STORAGE_KEY = "dg-near-2-language";
const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>("en");

  useEffect(() => {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    if (storedValue && APP_LANGUAGES.includes(storedValue as AppLanguage)) {
      setLanguageState(storedValue as AppLanguage);
    }
  }, []);

  const setLanguage = (value: AppLanguage) => {
    setLanguageState(value);
    window.localStorage.setItem(STORAGE_KEY, value);
  };

  const value = useMemo(
    () => ({
      language,
      locale: language,
      setLanguage,
      setLocale: setLanguage,
      t: dictionary[language],
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider.");
  }

  return context;
}
