import React from "react";
import { Helmet } from "react-helmet";

import { createTitle } from "../../utils/html";
import { Home } from "../Home/Home";
import { Link } from "../ui/Link";
import { QrCodeVideoPreview } from "./styles";
import { useScanSpace } from "./useScanSpace";

export const ScanSpace: React.FC = () => {
  const { previewRef } = useScanSpace();

  return (
    <Home>
      <Helmet>
        <title>{createTitle("Join a space...")}</title>
      </Helmet>
      <QrCodeVideoPreview ref={previewRef} />
      <Link to="/create">... or create a space</Link>
    </Home>
  );
};
