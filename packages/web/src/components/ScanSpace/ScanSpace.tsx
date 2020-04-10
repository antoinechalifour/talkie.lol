import React, { useEffect, useRef } from "react";
import QrScanner from "qr-scanner";
// @ts-ignore
import QrScannerWorkerPath from "!!file-loader!qr-scanner/qr-scanner-worker.min.js"; // eslint-disable-line

import { Home } from "../Home/Home";
import { Link } from "../ui/Link";
import { QrCodeVideoPreview } from "./styles";
import { history } from "../../utils/history";

QrScanner.WORKER_PATH = QrScannerWorkerPath;

export const ScanSpace: React.FC = () => {
  const previewRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!previewRef.current) {
      return;
    }

    const qrScanner = new QrScanner(previewRef.current, (result: string) => {
      qrScanner.destroy();
      history.push(result);
    });

    qrScanner.start();

    return () => {
      qrScanner.destroy();
    };
  }, []);

  return (
    <Home>
      <QrCodeVideoPreview ref={previewRef}></QrCodeVideoPreview>
      <Link to="/create">... or create a space</Link>
    </Home>
  );
};
