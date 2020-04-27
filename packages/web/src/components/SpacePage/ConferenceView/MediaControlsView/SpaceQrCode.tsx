import React, { useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import QrCode from "qrcode.react";

import { QrCodeArea } from "./styles";
import { toast } from "react-toastify";

export const SpaceQrCode: React.FC = () => {
  const copy = useCallback(() => {
    const canvas = document.querySelector(
      "#scape-qrcode"
    )! as HTMLCanvasElement;

    canvas.toBlob((blob) => {
      if (!blob) return;

      // @ts-ignore
      const item = new ClipboardItem({ "image/png": blob });

      // @ts-ignore
      navigator.clipboard.write([item]);

      toast.info("The QR code has been copied to your clipboard");
    });
  }, []);

  return (
    <QrCodeArea>
      <button onClick={copy}>
        <span>Share this QRCode with your friends</span>{" "}
        <FontAwesomeIcon icon={faCopy} />
      </button>

      <QrCode
        id="scape-qrcode"
        renderAs="canvas"
        size={250}
        value={window.location.pathname}
      />
    </QrCodeArea>
  );
};
