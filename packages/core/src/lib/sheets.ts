import Google from './google';
import DbConnector from './db-connector';
class Sheets {
  accessToken: any;
  db: DbConnector;
  constructor(accessToken: string) {
    this.accessToken = accessToken;
    this.db = new DbConnector();
  }
  async getSheetSettings(userId: string) {
    return this.db.getSheetSettings(userId);
  }
}

export default Sheets;
