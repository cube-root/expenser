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
import { doughnutChartDataConverter } from '../../helper/chart';

const GetExpense = () => {
  const [isLoading, setLoading] = useState(false);
  const [user] = useUser();
  const [sheet] = useSheet();
  const [data, setData] = useState([]);
  const [doughnutData, setDoughnutData] = useState({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
      borderColor: []
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
      try {
        console.log(doughnutChartDataConverter(response.data))
      } catch (error) {
        console.log(error);
      }
      setDoughnutData(doughnutChartDataConverter(response.data))
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
        {!isLoading && data && (
          <>
            <div className='col-span-1 flex justify-between items-start shadow-sm rounded-md bg-slate-50 dark:bg-slate-700 p-4 border-l-4 border-red-600'>
              <DoughnutApp data={doughnutData} />
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
