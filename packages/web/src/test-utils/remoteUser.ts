import { RemoteUser } from "../models/RemoteUser";

export const mockRemoteUser = (id: string, name): RemoteUser =>
  new (class extends RemoteUser {
    constructor() {
      super(id, name);
    }
  })();
