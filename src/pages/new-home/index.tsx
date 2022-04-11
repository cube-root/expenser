import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Header from '../../components/header/index';
import SetSpreadSheetId from '../../components/spreadsheet-id';
import AddExpense from '../add-expense';
const HomePage: NextPage = () => {
  const [spreadSheetLink, setSpreadSheetLink] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (global && global.window) {
      const spreadSheetLinkLocal =
        global.window.localStorage.getItem('spreadSheetLink');
      setSpreadSheetLink(spreadSheetLinkLocal);
    }
  }, [spreadSheetLink]);

  useEffect(() => {
    if (global) {
      if (global.sessionStorage.getItem('accessToken') === null) {
        router.push('/login');
      }
    }
  }, []);
  return (
    <div className="flex flex-col h-screen">
      {(spreadSheetLink === null || !spreadSheetLink) && (
        <div className="flex-1 overflow-y-auto pt-8 items-center align-middle pt-10">
          <SetSpreadSheetId setSpreadSheetLinkCallBack={setSpreadSheetLink} />
        </div>
      )}
      {spreadSheetLink && <AddExpense />}
    </div>
  );
};

export default HomePage;
