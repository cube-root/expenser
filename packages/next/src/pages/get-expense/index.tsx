import axios from 'axios';
import { useEffect, useReducer } from 'react';
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
import { ButtonGroup as Filter } from '../../components';
import Image from 'next/image';
import { InitialCard } from '../home/index'
import { orderByDate, getDataOnADate, getDataOnDateBetween, getTotalAmount } from '../../helper/filter';

const initialState = {
  isLoading: false,
  data: [],
  initialData: [],
  filterType: '',
  isDeleting: false,
  doughnutData: {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderColor: [],
      },
    ],
  },
  lineData: {
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  },
  totalAmount: 0
};
type Action = {
  type: string,
  value: any
}
const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case 'set_loading': {
      return { ...state, isLoading: action.value }
    }
    case 'set_data': {
      return { ...state, data: action.value }
    }
    case 'set_doughnut_data': {
      return { ...state, doughnutData: action.value }
    }
    case 'set_line_data': {
      return { ...state, lineData: action.value }
    }
    case 'set_filter_type': {
      return { ...state, filterType: action.value }
    }
    case 'set_initial_value': {
      return { ...state, ...action.value };
    }
    case 'set_total_amount': {
      return { ...state, totalAmount: action.value }
    }
    default:
      return state;
  }
}

const GetExpense = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isLoading,
    data,
    isDeleting,
    doughnutData,
    filterType,
    lineData,
    initialData,
    totalAmount
  } = state;
  const setLoading = (value: boolean) => {
    dispatch({ type: 'set_loading', value })
  }
  const setData = (value: any) => {
    dispatch({ type: 'set_data', value });
  }
  const setDoughnutData = (value: any) => {
    dispatch({ type: 'set_doughnut_data', value })
  }
  // const setLineData = (value: any) => {
  //   dispatch({ type: 'set_line_data', value })
  // }
  const setFilterType = (value: any) => {
    dispatch({ type: 'set_filter_type', value })
  }
  const setInitialData = (value: any) => {
    dispatch({ type: 'set_initial_value', value });
  }
  const setTotalAmount = (value: any) => {
    dispatch({ type: 'set_total_amount', value });
  }
  const [user] = useUser();
  const [sheet] = useSheet();

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
      setInitialData({
        data: reverseArray,
        doughnutData: doughnutChartDataConverter(response.data),
        lineData: lineChartDataConverter(reverseArray.reverse()),
        initialData: reverseArray,
        // totalAmount: getTotalAmount(response.data)
      });
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Something went wrong');
    }
    setLoading(false);
  };
  // EXPENSE DELETE
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
  // FETCH DATA FROM API
  useEffect(() => {
    fetchData();
  }, []);
  // FILTER
  useEffect(() => {
    if (filterType && filterType.length > 0) {
      switch (filterType) {
        case 'today': {
          const filterData = getDataOnADate(initialData, moment(new Date()).format('MM/DD/YYYY'))
          setData(filterData);
          setDoughnutData(doughnutChartDataConverter(filterData))
          break;
        }
        case 'all': {
          setDoughnutData(doughnutChartDataConverter(initialData))
          setData(initialData);
          break;
        }
        case 'last-seven': {
          const filterData = getDataOnDateBetween(initialData,
            moment(new Date()).subtract(7, 'd').format('MM/DD/YYYY'),
            moment(new Date()).add(1, 'd').format('MM/DD/YYYY'),
          )
          setDoughnutData(doughnutChartDataConverter(filterData))
          setData(filterData);
          break;
        }
        default: {
          break;
        }
      }
    }

  }, [filterType])
  // CALCULATE TOTAL AMOUNT
  useEffect(() => {
    const totalAmount = getTotalAmount(data);
    setTotalAmount(totalAmount)
  }, [data])
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
        {!isLoading && (!initialData || initialData.length <= 0) && (
          <div className='mt-4'>
            <InitialCard />
          </div>
        )}
        {!isLoading && initialData && initialData.length > 0 && (
          <>
            <div className="flex items-center justify-between  mt-6">
              <h3 className="text-2xl leading-6 font-medium text-slate-900 dark:text-slate-50">
                Spending trends
              </h3>
              <Filter
                onClickFilter={(filterType) => {
                  setFilterType(filterType)
                }}
              />
            </div>
            <div className="grid sm:grid-cols-3 grid-cols-1 gap-6 my-4">
              <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-md text-white">
                <DoughnutApp data={doughnutData} />
                <div className='mt-4'>
                  TOTAL AMOUNT: {totalAmount}
                </div>
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
                data.map((item: any, index: number) => {
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
                      paymentMode={mapResult?.paymentMode?.value}
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
