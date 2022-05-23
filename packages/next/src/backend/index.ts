import Sheets from './src/sheets';
import Telegram from './src/telegram';
import { getKeys, revokeKeys } from './src/keys';
import settings from './src/settings';
import { verifyKey } from './helper/token'
export {
    Sheets,
    Telegram,
    getKeys,
    revokeKeys,
    settings,
    verifyKey as verifyToken
};

