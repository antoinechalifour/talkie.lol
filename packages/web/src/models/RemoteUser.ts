export class RemoteUser {
  protected constructor(private _id: string, private _name: string) {}

  static create(id: string, name: string) {
    return new RemoteUser(id, name);
  }

  is(user: RemoteUser) {
    return this._id === user._id;
  }

  id() {
    return this._id;
  }

  name() {
    return this._name;
  }
}
