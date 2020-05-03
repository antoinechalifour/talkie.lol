/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AwilixContainer } from "awilix";

import { TalkieApp } from "../src/application/server";
import { SpacePort } from "../src/usecase/ports/SpacePort";
import { SpaceId } from "../src/domain/entities/SpaceId";
import { createTestApp } from "./utils/createTestApp";
import { TalkieTestClient } from "./utils/TalkieTestClient";

describe("createSpace", () => {
  let app: TalkieApp;
  let port: string;
  let container: AwilixContainer;
  let client: TalkieTestClient;
  let spacePort: SpacePort;

  beforeEach(async () => {
    ({ app, port, container } = await createTestApp());

    spacePort = container.resolve<SpacePort>("spacePort");
    client = TalkieTestClient.createAnonymousClient(port);

    await app.run();
  });

  afterEach(async () => {
    await app.stop();
  });

  it("should create a new space", async () => {
    // When
    const response = await client.createSpace();

    // Then
    const spaceId = response.data!.createSpace.space.id;
    const persistedSpace = await spacePort.findSpaceById(
      SpaceId.fromString(spaceId)
    );

    expect(response.data!.createSpace).toMatchObject({
      success: true,
      space: {
        id: persistedSpace.id.get(),
        slug: persistedSpace.slug,
      },
    });
  });
});
