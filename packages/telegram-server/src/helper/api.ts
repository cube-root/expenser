import axios from 'axios';

const url = process.env.URL || 'http://localhost:3000';

const api = {
  configure: async (apiSecret: string, chatId: number | string) => {
    await axios.post(`${url}/api/v1/integrations/telegram/configure`, {
      API_SECRET: apiSecret,
      CHAT_ID: chatId,
    });
  },
  add: async ({
    amount,
    remark,
    type,
    currency,
    chatId,
  }:
    {
      amount?: number,
      remark?: string,
      type?: string,
      currency?: string
      chatId: number | string
    }) => {
    await axios.post(`${url}/api/v1/integrations/telegram/add-expense`, {
      data: {
        amount,
        remark,
        type,
        symbol: currency || '$',
      },
    }, {
      headers: {
        chat_id: chatId,
        'Content-Type': 'application/json',
      },
    });
  },
  changeSheet: async (
    sheetId:string,
    sheetLink: string,
    chatId:string | number,
  ) => {
    await axios.post(`${url}/api/v1/integrations/telegram/change-sheet`, {
      sheetId,
      sheetLink,
    }, {
      headers: {
        chat_id: chatId,
        'Content-Type': 'application/json',
      },
    });
  },
};

export default api;
