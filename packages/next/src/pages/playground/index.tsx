import React, { useEffect, useState } from 'react';
import DoughnutApp from '../../components/charts/Doughnut';
import { doughnutChartDataConverter } from '../../helper/chart'
const data = [{
  "data": {
    "id": {
      "value": "1655654807774",
      "dataType": "int",
      "name": "Id"
    },
    "date": {
      "value": "6/19/2022",
      "dataType": "datetime",
      "name": "Date"
    },
    "amount": {
      "value": "100",
      "dataType": "float",
      "name": "Amount"
    },
    "symbol": {
      "value": "$",
      "dataType": "string",
      "name": "Symbol"
    },
    "type": {
      "value": "food",
      "dataType": "string",
      "name": "Type"
    },
    "remark": {
      "value": "test",
      "dataType": "string",
      "name": "Remark"
    }
  },
  "meta": {}
},
{
  "data": {
    "id": {
      "value": "1655661841297",
      "dataType": "int",
      "name": "Id"
    },
    "date": {
      "value": "6/19/2022",
      "dataType": "datetime",
      "name": "Date"
    },
    "amount": {
      "value": "120",
      "dataType": "float",
      "name": "Amount"
    },
    "symbol": {
      "value": "₹",
      "dataType": "string",
      "name": "Symbol"
    },
    "type": {
      "value": "other",
      "dataType": "string",
      "name": "Type"
    },
    "remark": {
      "value": "Lunch",
      "dataType": "string",
      "name": "Remark"
    }
  },
  "meta": {}
},
{
  "data": {
    "id": {
      "value": "1655662575716",
      "dataType": "int",
      "name": "Id"
    },
    "date": {
      "value": "6/19/2022",
      "dataType": "datetime",
      "name": "Date"
    },
    "amount": {
      "value": "100",
      "dataType": "float",
      "name": "Amount"
    },
    "symbol": {
      "value": "$",
      "dataType": "string",
      "name": "Symbol"
    },
    "type": {
      "value": "petrol",
      "dataType": "string",
      "name": "Type"
    },
    "remark": {
      "value": "Thatt",
      "dataType": "string",
      "name": "Remark"
    }
  },
  "meta": {}
},
{
  "data": {
    "id": {
      "value": "1655662601043",
      "dataType": "int",
      "name": "Id"
    },
    "date": {
      "value": "6/19/2022",
      "dataType": "datetime",
      "name": "Date"
    },
    "amount": {
      "value": "111",
      "dataType": "float",
      "name": "Amount"
    },
    "symbol": {
      "value": "$",
      "dataType": "string",
      "name": "Symbol"
    },
    "type": {
      "value": "food",
      "dataType": "string",
      "name": "Type"
    }
  },
  "meta": {}
},

{
  "data": {
    "id": {
      "value": "1655662660858",
      "dataType": "int",
      "name": "Id"
    },
    "date": {
      "value": "6/19/2022",
      "dataType": "datetime",
      "name": "Date"
    },
    "amount": {
      "value": "100",
      "dataType": "float",
      "name": "Amount"
    },
    "symbol": {
      "value": "₹",
      "dataType": "string",
      "name": "Symbol"
    },
    "type": {
      "value": "petrol",
      "dataType": "string",
      "name": "Type"
    },
    "remark": {
      "value": "Eed",
      "dataType": "string",
      "name": "Remark"
    }
  },
  "meta": {}
},
{
  "data": {
    "id": {
      "value": "1655662878760",
      "dataType": "int",
      "name": "Id"
    },
    "date": {
      "value": "6/19/2022",
      "dataType": "datetime",
      "name": "Date"
    },
    "amount": {
      "value": "200",
      "dataType": "float",
      "name": "Amount"
    },
    "symbol": {
      "value": "$",
      "dataType": "string",
      "name": "Symbol"
    },
    "type": {
      "value": "food",
      "dataType": "string",
      "name": "Type"
    }
  },
  "meta": {}
}
]
export default function App() {
  const [doughnutData, setDoughnutData] = useState([])
  useEffect(() => {
    setDoughnutData(doughnutChartDataConverter(data));
  }, [])
  return (
    <div>
      <DoughnutApp data={doughnutData} />
    </div>
  );
}
