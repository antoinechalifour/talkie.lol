import React from "react";
import { Helmet } from "react-helmet";

import { createTitle } from "../../utils/html";
import { Home } from "../Home/Home";
import { Button } from "../ui/Button";
import { Link } from "../ui/Link";
import { CreateOrJoin } from "./styles";
import { useCreateSpace } from "./useCreateSpace";

export const CreateSpace: React.FC = () => {
  const { isCreating, createSpace } = useCreateSpace();

  return (
    <Home>
      <Helmet>
        <title>{createTitle("Create a space")}</title>
      </Helmet>
      {isCreating ? (
        <p>Creating space</p>
      ) : (
        <CreateOrJoin>
          <Button onClick={createSpace}>Create a space</Button>
          <Link to="/join">... or join an existing space</Link>
        </CreateOrJoin>
      )}
    </Home>
  );
};
