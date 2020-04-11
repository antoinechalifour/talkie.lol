const APP_NAME = "WebRTC Experiments";

export const createTitle = (message: string) =>
  message ? `${message} | ${APP_NAME}` : APP_NAME;
