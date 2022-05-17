import axios from "axios";
const api = {
    sendMessage: async (chatId: string | string[], message: string) => {
        try {
            await axios.get(
                `${process.env.WEBHOOK_URL}/api/v1/webhooks/send-message?chatId=${chatId}&text=${message}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.WEBHOOK_TOKEN}`
                    }
                }
            );
        } catch (error: any) {
            console.log(error)
        }
    }
}


export default api;