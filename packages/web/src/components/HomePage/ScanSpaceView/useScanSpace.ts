import { useCallback, useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
// @ts-ignore
import QrScannerWorkerPath from "!!file-loader!qr-scanner/qr-scanner-worker.min.js"; // eslint-disable-line

import { history } from "../../../utils/history";

QrScanner.WORKER_PATH = QrScannerWorkerPath;

export const useScanSpace = () => {
  const [spaceName, setSpaceName] = useState("");
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

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      history.push(`/space/${spaceName}`);
    },
    [spaceName]
  );

  return { previewRef, spaceName, setSpaceName, onSubmit };
};
