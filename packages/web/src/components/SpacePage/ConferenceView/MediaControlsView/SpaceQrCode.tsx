import React from "react";
import QrCode from "qrcode.react";

import { QrCodeArea } from "./styles";

export const SpaceQrCode: React.FC = () => (
  <QrCodeArea>
    <p>Share this QRCode with your friends</p>

    <QrCode renderAs="svg" size={250} value={window.location.pathname} />
  </QrCodeArea>
);
