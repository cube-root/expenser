import axios from 'axios';
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import Cards from '../../components/card';
import moment from 'moment';
import SideBar from '../../components/sidebar';
import { RefreshIcon } from '@heroicons/react/solid';
import GetStorageData from '../../hooks/get-data';
import { toast } from 'react-toastify';

type FirebaseConfigType = {
  FIREBASE_API_KEY: string | any;
  FIREBASE_AUTH_DOMAIN: string | any;
  PROJECT_ID: string | any;
  STORAGE_BUCKET: string | any;
  MESSAGING_SENDER_ID: string | any;
  APP_ID: string | any;
};


const GetExpense = (props: { firebaseConfig: FirebaseConfigType }) => {
  const accessToken = useRef<any>(null);
  const [isLoading, setLoading] = useState(false);
  const {isLoading: isLoadingStorageData,data:storage} = GetStorageData(props.firebaseConfig);
  const [data, setData] = useState([]);
  const sheetId = useRef<any>(null);
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        '/api/sheets/get',
        {
          accessToken: accessToken.current,
          sheetId: sheetId.current,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (response.status && response.data) {
        setData(response.data.data);
      }
    } catch (error: any) {
      toast.error('Something went wrong. Please try again later.');
      if (
        error.response &&
        error.response.data &&
        error.response.data.serverError
      ) {
        toast.error(error.response.data.serverError || error.message || '');
        if (error.response.data.actualErrorCode === 401) {
          toast.info('Please login again.');
        }
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const token = storage.accessToken;
    const sheetIdLocal = storage && storage.sheet ? storage.sheet.spreadSheetId : undefined;
    if (token && sheetId) {
      accessToken.current = token;
      sheetId.current = sheetIdLocal;
      fetchData();
    } else {
      // router.push('/login');
    }
  }, [storage]);

  return (
    <div>
      <SideBar />
      <div className="md:pl-72 flex flex-col flex-1  h-screen overflow-y-auto bg-gray-900 no-scrollbar">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl  text-white font-mono">Expense History</h1>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="py-4 ">
              <div className="md:border-4 bg-black md:border-dashed md:border-gray-200 rounded-lg h-auto pb-10">
                <div className="flex flex-col my-10 items-center">
                  {(isLoading || isLoadingStorageData) && (
                    <div className="flex flex-col items-center justify-center ">
                      <div className="p-4">
                        <RefreshIcon
                          className="animate-spin h-13 w-10"
                          color="white"
                        />
                      </div>
                      <p className="text-white font-mono">
                        Loading
                        <span className="animate-pulse pl-1 pr-1">...</span>
                        Please wait
                        <span className="animate-pulse pl-1">!!!</span>
                      </p>
                    </div>
                  )}
                  {!isLoading && data && (
                    <div className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mx-3 pt-6">
                      {data.map((item: any, index) => {
                        const { mapResult, meta } = item;
                        return (
                          <Cards
                            meta={meta}
                            key={index}
                            heading={
                              mapResult.type && mapResult.type.value
                                ? mapResult.type.value.toUpperCase()
                                : ' '
                            }
                            currency={
                              mapResult.symbol && mapResult.symbol.value
                                ? mapResult.symbol.value
                                : ' '
                            }
                            amount={
                              mapResult.amount ? mapResult.amount.value : ' '
                            }
                            date={
                              mapResult.date
                                ? moment(mapResult.date.value).format('LL')
                                : ' '
                            }
                            description={
                              mapResult.remark ? mapResult.remark.value : ' '
                            }
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  return {
    props: {
      firebaseConfig: {
        FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
        FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
        PROJECT_ID: process.env.PROJECT_ID,
        STORAGE_BUCKET: process.env.STORAGE_BUCKET,
        MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
        APP_ID: process.env.APP_ID,
      },
    }, // will be passed to the page component as props
  };
}

export default GetExpense;
