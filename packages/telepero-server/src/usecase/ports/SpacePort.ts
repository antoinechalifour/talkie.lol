import { Space } from "../../domain/entities/Space";
import { SpaceId } from "../../domain/entities/SpaceId";

export interface SpacePort {
  saveSpace(space: Space): Promise<void>;
  findSpaceById(spaceId: SpaceId): Promise<Space>;
  findSpaceBySlug(slug: string): Promise<Space>;
}
