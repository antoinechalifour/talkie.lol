import React from "react";
import { Helmet } from "react-helmet";

import { createTitle } from "../../utils/html";
import { HomeLayout } from "../HomeLayout/HomeLayout";
import { Button } from "../ui/Button";
import { Link } from "../ui/Link";
import { useCreateSpace } from "./useCreateSpace";
import { CreateOrJoin } from "./styles";

export const CreateSpacePage: React.FC = () => {
  const { isCreating, createSpace } = useCreateSpace();

  return (
    <HomeLayout>
      <Helmet>
        <title>{createTitle("Create a space")}</title>
      </Helmet>

      {isCreating ? (
        <Button disabled loading>
          Creating space (this may take a few seconds)...
        </Button>
      ) : (
        <CreateOrJoin>
          <Button onClick={createSpace}>
            Create a space to chat with your friends
          </Button>
          <Link to="/join">... or join one of your friend's space</Link>
        </CreateOrJoin>
      )}
    </HomeLayout>
  );
};
