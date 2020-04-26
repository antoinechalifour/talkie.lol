import React from "react";
import { Helmet } from "react-helmet";

import { createTitle } from "../../../utils/html";
import { Link } from "../../ui/Link";
import { VideoAspectRatioContainer } from "../../ui/VideoAspectRatioContainer";
import { VStack } from "../../ui/VStack";
import { useScanSpace } from "./useScanSpace";
import { QrCodeVideoPreview } from "./styles";

export const ScanSpaceView: React.FC = () => {
  const { previewRef } = useScanSpace();

  return (
    <>
      <Helmet>
        <title>{createTitle("Join a space...")}</title>
      </Helmet>

      <VStack>
        <p>
          Ask your friends for their Talkie QR code and scan it to join their
          space.
        </p>

        <VideoAspectRatioContainer>
          <QrCodeVideoPreview ref={previewRef} />
        </VideoAspectRatioContainer>

        <Link to="/home">... or create a space</Link>
      </VStack>
    </>
  );
};
