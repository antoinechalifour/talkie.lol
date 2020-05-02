import { SpaceId } from "../domain/entities/SpaceId";
import { SpaceMemoryAdapter } from "../infrastructure/SpaceMemoryAdapter";
import { SpacePort } from "./ports/SpacePort";
import { CreateSpace } from "./CreateSpace";

describe("CreateSpace", () => {
  let createSpace: CreateSpace;
  let spacePort: SpacePort;

  beforeEach(() => {
    spacePort = new SpaceMemoryAdapter();
    createSpace = new CreateSpace({ spacePort });
  });

  it("should create a new space", async () => {
    // Given When
    const space = await createSpace.execute();

    // Then
    const expectedSpace = {
      id: expect.any(SpaceId),
      slug: expect.any(String),
    };
    expect(space).toEqual(expectedSpace);
  });

  it("should persist the created space", async () => {
    // Given When
    const space = await createSpace.execute();

    // Then
    const persistedSpace = await spacePort.findSpaceById(space.id);
    expect(persistedSpace).toEqual(space);
  });
});
