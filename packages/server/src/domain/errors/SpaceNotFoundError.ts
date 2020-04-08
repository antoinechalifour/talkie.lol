export class SpaceNotFoundError extends Error {
  constructor(idOrSlug: string) {
    super(`Space not found. (Id or slug: ${idOrSlug}}`);
  }
}
