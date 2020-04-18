const APP_NAME = "Talkie.LOL";

export const createTitle = (message: string) =>
  message ? `${message} | ${APP_NAME}` : APP_NAME;
