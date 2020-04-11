import { useHistory } from "react-router-dom";
import { useMutation } from "urql";
import { useCallback } from "react";
import { loader } from "graphql.macro";

const CREATE_SPACE = loader("./CreateSpace.graphql");

interface CreateSpaceResponse {
  createSpace: {
    space: {
      slug: string;
    };
  };
}

export const useCreateSpace = () => {
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
