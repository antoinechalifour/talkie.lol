import React, { useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import QrCode from "qrcode.react";
import { toast } from "react-toastify";

import { copyCanvasToClipboard } from "../../../../utils/canvas";
import { useDropdownContext } from "../../../ui/DropdownButton/useDropdownContext";
import { QrCodeArea } from "./styles";

export const SpaceQrCode: React.FC = () => {
  const { close } = useDropdownContext();

  const copy = useCallback(async () => {
    const canvas = document.querySelector(
      "#scape-qrcode"
    )! as HTMLCanvasElement;

    await copyCanvasToClipboard(canvas);

    close();
    toast.success("The QR code has been copied to your clipboard");
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
