import { Space } from "../../../domain/entities/Space";

export const SpaceResolver = {
  id: (space: Space): string => space.id.get(),
};
