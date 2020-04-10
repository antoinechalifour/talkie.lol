import React from "react";
import QrCode from "qrcode.react";

import { QrCodeWrapper } from "./styles";

export const SpaceQrCode: React.FC = () => (
  <QrCodeWrapper>
    <QrCode value={window.location.pathname} />
  </QrCodeWrapper>
);
