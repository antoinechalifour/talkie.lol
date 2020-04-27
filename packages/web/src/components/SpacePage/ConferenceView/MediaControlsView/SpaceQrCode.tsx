import React, { useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import QrCode from "qrcode.react";
import { toast } from "react-toastify";

import { QrCodeArea } from "./styles";
import { useDropdownContext } from "../../../ui/DropdownButton/useDropdownContext";

const canvasToBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) reject();
      else resolve(blob);
    });
  });

export const SpaceQrCode: React.FC = () => {
  const { close } = useDropdownContext();

  const copy = useCallback(async () => {
    const canvas = document.querySelector(
      "#scape-qrcode"
    )! as HTMLCanvasElement;

    const blob = await canvasToBlob(canvas);

    // @ts-ignore
    const item = new ClipboardItem({ "image/png": blob });
    // @ts-ignore
    await navigator.clipboard.write([item]);

    close();

    toast.info("The QR code has been copied to your clipboard");
  }, [close]);

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
