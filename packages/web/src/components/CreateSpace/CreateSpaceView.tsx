import React, { useCallback } from "react";
import { useMutation } from "urql";
import { loader } from "graphql.macro";
import { useHistory } from "react-router-dom";
import { Background, AppTitle, Button } from "./styles";

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

export const CreateSpaceView: React.FC = () => {
  const { isCreating, createSpace } = useCreateSpace();

  return (
    <Background>
      <AppTitle>WebRTC Experiments</AppTitle>

      {isCreating ? (
        <p>Creating space</p>
      ) : (
        <Button onClick={createSpace}>Create a space</Button>
      )}
    </Background>
  );
};
