import React, { createContext, ReactNode, useState } from 'react';

export type Language = {
  name: string;
  locale: string;
};

const LANGUAGES: { [k: string]: Language } = {
  ENGLISH_LANGUAGE: {
    name: 'English',
    locale: 'en',
  },
  FRENCH_LANGUAGE: {
    name: 'French',
    locale: 'fr',
  },
  SPANISH_LANGUAGE: {
    name: 'Spanish',
    locale: 'es',
  },
};

export const ALL_LANGUAGES = Object.values(LANGUAGES);

type LanguageSettings = {
  languageTrack: Language;
  setLanguageTrack: (lang: Language) => void;
};

const DEFAULT_LANGUAGE_SETTINGS = {
  languageTrack: LANGUAGES.ENGLISH_LANGUAGE,
  setLanguageTrack: (_: Language) => null,
};
export const LanguageContext = createContext<LanguageSettings>(DEFAULT_LANGUAGE_SETTINGS);

export const LanguageSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [languageTrack, setLanguageTrack] = useState<Language>(ALL_LANGUAGES[0]);

  const value: LanguageSettings = {
    languageTrack,
    setLanguageTrack,
  };
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
