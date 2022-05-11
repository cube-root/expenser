# API

## TO get the keys

```
 curl -X POST --header 'authorization: Bearer TokenFromTheDashboard' https://expenser-one.vercel.app/api/v1/integrations/keys
{"API_KEY":"sample_api_key","API_SECRET":"sample_secret_key"}
```

## To add expense to sheet

```
curl --header 'API_KEY: API_KEY_FROM_DASHBOARD' --header 'API_SECRET: API_SECRET_FROM_DASHBOARD' https://expenser-one-vercel.app/api/v1/sheets/get?sheetId=SHEET_ID
```

sample response

```json
[
  {
    "data": {
      "id": {
        "value": "1651088070297",
        "dataType": "int",
        "name": "Id"
      },
      "date": {
        "value": "4/28/2022",
        "dataType": "datetime",
        "name": "Date"
      },
      "amount": {
        "value": "250",
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
        "value": "Breakfast",
        "dataType": "string",
        "name": "Remark"
      }
    },
    "meta":{
        
    }
  }
]
```
