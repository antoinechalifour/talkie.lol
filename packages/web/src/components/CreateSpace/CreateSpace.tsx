import React, { useCallback } from "react";
import { useMutation } from "urql";
import { loader } from "graphql.macro";
import { useHistory } from "react-router-dom";

import { Home } from "../Home/Home";
import { Button } from "../ui/Button";
import { Link } from "../ui/Link";
import { CreateOrJoin } from "./styles";

const CREATE_SPACE = loader("./CreateSpace.graphql");

interface CreateSpaceResponse {
  createSpace: {
    space: {
      slug: string;
    };
  };
}

const useCreateSpace = () => {
  const history = useHistory();
  const [createSpaceResult, createSpaceMutation] = useMutation<
    CreateSpaceResponse
  >(CREATE_SPACE);

  const createSpace = useCallback(
    async function onClick() {
      const result = await createSpaceMutation();

      if (result.data) {
        history.push(`/space/${result.data.createSpace.space.slug}`);
      }
    },
    [createSpaceMutation, history]
  );

  return {
    isCreating: createSpaceResult.fetching,
    createSpace,
  };
};

export const CreateSpace: React.FC = () => {
  const { isCreating, createSpace } = useCreateSpace();

  return (
    <Home>
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
