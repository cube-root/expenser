import Google from './google';
import DbConnector from './db-connector';
class User extends Google {
  accessToken: any;
  db: DbConnector;
  constructor(accessToken: string) {
    super(accessToken);
    this.accessToken = accessToken;
    this.db = new DbConnector();
  }
  async login() {
    const user: any = await this.verifyUser();
    // add login response to db
    const userResponse = await this.db.login(user);
    return userResponse;
  }
}

export default User;
