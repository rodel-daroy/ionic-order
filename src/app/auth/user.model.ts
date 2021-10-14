export class User {
  constructor(
    public id: string,
    public email: string,
    private _token: string
  ) {}

  get token() {
    if (!this.email) {
      return null;
    }
    return this._token;
  }

}

  