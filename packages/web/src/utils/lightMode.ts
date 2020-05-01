const THEME_MODE_KEY = "theme_mode";
const THEME_MODE_FROM_LOCAL_STORAGE = window.localStorage.getItem(
  THEME_MODE_KEY
);
const LOCAL_STORAGE_IS_LIGHT_MODE = THEME_MODE_FROM_LOCAL_STORAGE === "light";

export const hasPrevisoulyUsedLightMode = () => LOCAL_STORAGE_IS_LIGHT_MODE;

export const persistThemeMode = (isLightMode: boolean) => {
  const mode = isLightMode ? "light" : "dark";

  window.localStorage.setItem(THEME_MODE_KEY, mode);
};

export const prefersLightMode = () =>
  window.matchMedia("prefers-color-scheme: light").matches;
