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
import { doughnutChartDataConverter, barChartDataConverter, lineChartDataConverter } from '../../helper/chart';
import BarChart from '../../components/charts/Bar';
import LineChart from '../../components/charts/Line';

const GetExpense = () => {
  const [isLoading, setLoading] = useState(false);
  const [user] = useUser();
  const [sheet] = useSheet();
  const [data, setData] = useState([]);
  const [isDeleting] = useState(false);
  const [doughnutData, setDoughnutData] = useState({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
      borderColor: []
    }]
  });
  const [barData, setBarData] = useState({
    labels: [],
    datasets: [{
      data: [],

    }]
  })
  const [lineData, setLineData] = useState({
    labels: [],
    datasets: [{
      data: [],

    }]
  })

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
      setData(response.data.reverse());
      setDoughnutData(doughnutChartDataConverter(response.data))
      setBarData(barChartDataConverter(response.data.reverse()))
      setLineData(lineChartDataConverter(response.data.reverse()))
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    }
    setLoading(false);
  }

  const onDeleteExpense = async (data: any) => {
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
      toast.error(error.message || 'Something went wrong');
    }
    setLoading(false);

  }
  useEffect(() => {
    fetchData();
  }, [])

  return (
    <SideBar>
      <div className="ml-5 mr-3">
        {(isLoading) && (
          <div className="flex flex-col items-center justify-center ">
            <div className="p-4">
            </div>
            <p className="text-black  dark:text-white ">
              Loading
              <span className="animate-pulse pl-1 pr-1 dark:text-white">...</span>
              Please wait
              <span className="animate-pulse pl-1 dark:text-white">!!!</span>
            </p>
          </div>
        )}
        {!isLoading && data && data.length > 0 && (
          <>
            <div className='col-span-1 flex justify-between items-start shadow-sm rounded-md bg-slate-50 dark:bg-slate-700 p-4 border-l-4 border-red-600'>
              <DoughnutApp data={doughnutData} />
              <LineChart data={lineData} />
              <BarChart data={barData} />

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
                          ? moment(mapResult.date.value).startOf('days').fromNow()
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
