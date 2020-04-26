import React from "react";
import { Helmet } from "react-helmet";

import { createTitle } from "../../../utils/html";
import { Button } from "../../ui/Button";
import { Link } from "../../ui/Link";
import { VStack } from "../../ui/VStack";
import { useCreateSpace } from "./useCreateSpace";

export const CreateSpaceView: React.FC = () => {
  const { isCreating, createSpace } = useCreateSpace();

  return (
    <>
      <Helmet>
        <title>{createTitle("Create a space")}</title>
      </Helmet>

      <VStack>
        <p>
          Talkie is a free, secure, peer-to-peer video chat app that you can use
          to talk to your friends. <br />
          To start using Talkie, either create a space and send the link to your
          friends, or join an existing space by scanning a Talkie QrCode.
        </p>

        {isCreating ? (
          <Button disabled loading>
            Creating your space (this may take a few seconds)...
          </Button>
        ) : (
          <>
            <Button onClick={createSpace}>
              Create a space to chat with your friends
            </Button>

            <Link to="/home/join">
              ... or scan a QR code to join an existing space
            </Link>
          </>
        )}
      </VStack>
    </>
  );
};
