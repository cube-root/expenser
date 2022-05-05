import {
    getApp,
    getDB,
    getUserBySecret,
    setTelegramChatId,
    getTelegramChatId,
    getSheetData
} from '../../../api-helper/firebase/operations';
import { sheets } from '../../../../'
type data = {
    API_KEY?: string,
    API_SECRET?: string,
    CHAT_ID?: string,
}

const configure = async ({
    API_SECRET: apiSecret,
    CHAT_ID: chatId,
}: data) => {
    if (!chatId) {
        throw new Error('Invalid chat id')
    }
    const app = getApp();
    const db = getDB(app);
    const userData = await getUserBySecret(db, apiSecret);
    await setTelegramChatId(db, typeof chatId === 'string' ? chatId : `${chatId}`, {
        uid: userData.uid,
        email: userData.email,
        API_KEY: userData.API_KEY,
        API_SECRET: userData.API_SECRET,
    });
}

type inputData = { amount: string, remark: string, symbol: string, type: string }
const addExpense = async (chatId: any, data: inputData) => {
    const app = getApp();
    const db = getDB(app);
    const chatData = await getTelegramChatId(db, chatId);
    const { uuid, API_SECRET, API_KEY } = chatData;
    // sheet-id
    const sheetData = await getSheetData(db, uuid);
    const { spreadSheetId } = sheetData;
    await sheets.appendSpreadSheet({
        sheetId: spreadSheetId,
        data
    }, { API_KEY, API_SECRET })
}
export {
    configure,
    addExpense
}