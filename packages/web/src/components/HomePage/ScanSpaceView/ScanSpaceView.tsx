import React from "react";
import { Helmet } from "react-helmet";

import { createTitle } from "../../../utils/html";
import { Link } from "../../ui/Link";
import { VideoAspectRatioContainer } from "../../ui/VideoAspectRatioContainer";
import { VStack } from "../../ui/VStack";
import { InputButtonGroup } from "../../ui/InputButtonGroup";
import { Button } from "../../ui/Button";
import { useScanSpace } from "./useScanSpace";
import { QrCodeVideoPreview } from "./styles";

export const ScanSpaceView: React.FC = () => {
  const { previewRef, spaceName, setSpaceName, onSubmit } = useScanSpace();

  return (
    <>
      <Helmet>
        <title>{createTitle("Join a space...")}</title>
      </Helmet>

      <VStack>
        <p>Enter your friends space name</p>

        <form onSubmit={onSubmit}>
          <InputButtonGroup>
            <input
              type="text"
              placeholder="ex: your-space-name"
              aria-label="Your friends space name"
              value={spaceName}
              onChange={(e) => setSpaceName(e.target.value)}
            />

            <Button type="submit">Join</Button>
          </InputButtonGroup>
        </form>

        <p>
          Ask your friends for their Talkie QR Code and scan it to join their
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
