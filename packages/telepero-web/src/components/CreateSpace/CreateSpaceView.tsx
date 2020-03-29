import React from "react";
import { useMutation } from "urql";
import { loader } from "graphql.macro";
import { useHistory } from "react-router-dom";

const CREATE_SPACE = loader("./CreateSpace.graphql");

interface CreateSpaceResponse {
  createSpace: {
    space: {
      slug: string;
    };
  };
}

export const CreateSpaceView: React.FC = () => {
  const history = useHistory();
  const [createSpaceResult, createSpace] = useMutation<CreateSpaceResponse>(
    CREATE_SPACE
  );

  async function onClick() {
    const result = await createSpace();

    if (result.data) {
      history.push(`/space/${result.data.createSpace.space.slug}`);
    }
  }

  if (createSpaceResult.fetching) {
    return <p>Creating space...</p>;
  }

  return <button onClick={onClick}>Create a space</button>;
};
