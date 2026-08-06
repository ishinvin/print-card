import { createI18n } from "vue-i18n";
import en from "./locales/en.json";
import km from "./locales/km.json";

const STORAGE_KEY = "locale";
const SUPPORTED_LOCALES = ["en", "km"];

function detectLocale() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (SUPPORTED_LOCALES.includes(saved)) return saved;
  return navigator.language?.toLowerCase().startsWith("km") ? "km" : "en";
}

export const i18n = createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: "en",
  messages: { en, km },
});

export function setLocale(locale) {
  i18n.global.locale.value = locale;
  localStorage.setItem(STORAGE_KEY, locale);
}
