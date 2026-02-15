import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import de from "./locales/de.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    de: { translation: de },
  },
  lng: Localization.getLocales()[0]?.languageCode ?? "de",
  fallbackLng: "de",
  interpolation: { escapeValue: false },
});

export default i18n;
