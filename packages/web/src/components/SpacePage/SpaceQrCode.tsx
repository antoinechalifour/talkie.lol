import React from "react";
import QrCode from "qrcode.react";

export const SpaceQrCode: React.FC = () => (
  <QrCode value={window.location.pathname} />
);
