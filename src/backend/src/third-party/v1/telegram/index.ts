import { getApp, getDB, getUserBySecret, setTelegramChatId } from '../../../api-helper/firebase/operations';
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
    });
}
export {
    configure
}