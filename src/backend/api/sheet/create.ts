import axios from 'axios';
import { SHEET_URL } from './config';

type Data = {
  spreadsheetId?: string;
  properties: {
    title: string;
  };
};
const createSpreadSheet = async (accessToken: string, data: Data) => {
  const response = await axios.post(`${SHEET_URL}/spreadsheets`, data, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
      redirect: 'follow',
    },
  });
  return response.data;
};

export { createSpreadSheet };
