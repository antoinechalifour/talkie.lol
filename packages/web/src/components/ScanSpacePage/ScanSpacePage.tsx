import React from "react";
import { Helmet } from "react-helmet";

import { createTitle } from "../../utils/html";
import { HomeLayout } from "../HomeLayout/HomeLayout";
import { Link } from "../ui/Link";
import { useScanSpace } from "./useScanSpace";
import { QrCodeVideoPreview } from "./styles";

export const ScanSpacePage: React.FC = () => {
  const { previewRef } = useScanSpace();

  return (
    <HomeLayout>
      <Helmet>
        <title>{createTitle("Join a space...")}</title>
      </Helmet>
      <QrCodeVideoPreview ref={previewRef} />
      <Link to="/create">... or create a space</Link>
    </HomeLayout>
  );
};
