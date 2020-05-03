import { RemoteUser } from "../models/RemoteUser";

export const mockRemoteUser = (id: string, name: string): RemoteUser =>
  new (class extends RemoteUser {
    constructor() {
      super(id, name);
    }
  })();
