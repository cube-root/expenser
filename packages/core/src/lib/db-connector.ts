import Firebase from './db/firebase';

class DbConnector {
    connector: string
    db: Firebase
    constructor(connector='firebase'){
        this.connector = connector
        switch(connector){
            case '':
            default:{
                this.db = new Firebase()
            }
        }
    }
    async login(data:GooglePayload){
        const user = await this.db.setUser(data.user_id,data)
        return user;
    }
}

export default DbConnector;