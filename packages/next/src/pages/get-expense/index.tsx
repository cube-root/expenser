import axios from 'axios';
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import Cards from '../../components/card';
import moment from 'moment';
import SideBar from '../../components/sidebar';
// import { RefreshIcon } from '@heroicons/react/solid';
import GetStorageData from '../../hooks/get-data';
import { toast } from 'react-toastify';
import helper from '../../helper';

const GetExpense = () => {
  const accessToken = useRef<any>(null);
  const [isLoading, setLoading] = useState(false);
  const { isLoading: isLoadingStorageData, data: storage } = GetStorageData(helper.getFirebaseConfig());
  const [data, setData] = useState([]);
  const sheetId = useRef<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `/api/v1/sheets/get?sheetId=${sheetId.current}`,
          {
            headers: {
              'API_KEY': storage.API_KEY,
              'API_SECRET': storage.API_SECRET,
              'Content-Type': 'application/json',
            },
          },
        );
        setData(response.data.reverse());
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
    <>
      <SideBar>
        <div className='ml-5 mr-3'>
          {(isLoading || isLoadingStorageData) && (
            <div className="flex flex-col items-center justify-center ">
              <div className="p-4">
                {/* <RefreshIcon
                  className="animate-spin h-13 w-10"
                  color="black"
                /> */}
              </div>
              <p className="text-black font-mono">
                Loading
                <span className="animate-pulse pl-1 pr-1">...</span>
                Please wait
                <span className="animate-pulse pl-1">!!!</span>
              </p>
            </div>
          )}
          {!isLoading && data && (
              <Cards.CardWrapper>
                {data && data.map((item: any, index) => {
                  const { data: mapResult, meta } = item;
                  return (
                    <Cards.CardChild
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
                      startOf={
                        mapResult.date ? moment(mapResult.date.value).startOf('days').fromNow()
                          : ' '
                      }
                      description={
                        mapResult.remark ? mapResult.remark.value : ' '
                      }
                    />
                  );
                })}
              </Cards.CardWrapper>
          )}
        </div>
      </SideBar>
    </>
  );
};
export default GetExpense;
