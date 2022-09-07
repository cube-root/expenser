import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import Cards from '../../components/card';
import moment from 'moment';
import SideBar from '../../components/sidebar';
import useUser from '../../hooks/user';
import useSheet from '../../hooks/sheet';
import { toast } from 'react-toastify';
import withUser from '../../wrapper/check-user';
import DoughnutApp from '../../components/charts/Doughnut';
import {
  doughnutChartDataConverter,
  lineChartDataConverter,
} from '../../helper/chart';
import LineChart from '../../components/charts/Line';
// import { ButtonGroup } from '../../components';
import Image from 'next/image';
import { InitialCard } from '../home/index'
import { orderByDate } from '../../helper/order'
const GetExpense = () => {
  const [isLoading, setLoading] = useState(false);
  const [user] = useUser();
  const [sheet] = useSheet();
  const [data, setData] = useState([]);
  const [isDeleting] = useState(false);
  const [doughnutData, setDoughnutData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderColor: [],
      },
    ],
  });
  const [lineData, setLineData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/v1/sheets/get?sheetId=${sheet.sheetId}`,
        {
          headers: {
            API_KEY: user.API_KEY,
            API_SECRET: user.API_SECRET,
            'Content-Type': 'application/json',
          },
        },
      );

      const reverseArray = orderByDate(response.data);
      setData(reverseArray);
      setDoughnutData(doughnutChartDataConverter(response.data));
      setLineData(lineChartDataConverter(reverseArray.reverse()));
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Something went wrong');
    }
    setLoading(false);
  };

  const onDeleteExpense = async (data: any) => {
    toast.info("Expense deleting..Please wait !!");
    setLoading(true);
    try {
      await axios.post(
        `/api/v1/sheets/delete?sheetId=${sheet.sheetId}`, data,
        {
          headers: {
            API_KEY: user.API_KEY,
            API_SECRET: user.API_SECRET,
            'Content-Type': 'application/json',
          },
        },
      );
      toast.success("Deleted successfully !");
      await fetchData();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Something went wrong');
    }
    setLoading(false);

  }
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SideBar>
      <div className="ml-5 mr-3">
        {isLoading && (
          <div className="flex flex-col h-96 items-center justify-center ">
            <Image
              src="/images/file-load.gif"
              height={200}
              width={200}
              alt="Loading"
            />
          </div>
        )}
        {!isLoading && (!data || data.length <= 0) && (
          <div className='mt-4'>
            <InitialCard />
          </div>
        )}
        {!isLoading && data && data.length > 0 && (
          <>
            <div className="flex items-center justify-between  mt-6">
              <h3 className="text-2xl leading-6 font-medium text-slate-900 dark:text-slate-50">
                Spending trends
              </h3>
              {/* TODO */}
              {/* <ButtonGroup /> */}
            </div>
            <div className="grid sm:grid-cols-3 grid-cols-1 gap-6 my-4">
              <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-md text-white">
                <DoughnutApp data={doughnutData} />
              </div>
              <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-md sm:col-span-2">
                <LineChart data={lineData} />
              </div>
              {/* <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-md">
                <BarChart data={barData} />
              </div> */}
            </div>
            <Cards.CardWrapper>
              {data &&
                data.map((item: any, index) => {
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
                      amount={mapResult.amount ? mapResult.amount.value : ' '}
                      date={
                        mapResult.date
                          ? moment(mapResult.date.value).format('LL')
                          : ' '
                      }
                      startOf={
                        mapResult.date
                          ? moment(mapResult.date.value)
                            .calendar()?.split('at')[0]
                          : ' '
                      }
                      description={
                        mapResult.remark ? mapResult.remark.value : ' '
                      }
                      onClickDelete={() => {
                        onDeleteExpense(item)
                      }}
                      disableDeleteButton={isDeleting}
                    />
                  );
                })}
            </Cards.CardWrapper>
          </>
        )}
      </div>
    </SideBar>
  );
};
export default withUser(GetExpense);
