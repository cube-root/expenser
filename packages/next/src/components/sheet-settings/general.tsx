import { useState, useEffect } from 'react';
import axios from 'axios';
import GetStorageData from '../../hooks/get-data';
import helper from '../../helper';
const General = () => {
  const [isLoading, setLoading] = useState(false);
  const [currency, setCurrency] = useState<string>('$');
  const { data: storage } = GetStorageData(helper.getFirebaseConfig());
  const changeCurrency = async () => {
    try {
      if (currency !== undefined) {
        setLoading(true);
        const response = await axios.post(
          'api/v1/settings/general',
          {
            defaultCurrency: currency,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'x-api_key': storage.API_KEY,
              'x-api_secret': storage.API_SECRET,
            },
          },
        );
        console.log(response.data);
        setLoading(false);
      }
    } catch (error) {
      // do nothing
    }
  };
  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const response = await axios.get('api/v1/settings/general', {
          headers: {
            'Content-Type': 'application/json',
            'x-api_key': storage.API_KEY,
            'x-api_secret': storage.API_SECRET,
          },
        });
        if (response.data && response.data.defaultCurrency)
          setCurrency(response.data.defaultCurrency);
      } catch (error) {
        // do nothing
      }
      setLoading(false);
    })();
  }, [storage.API_KEY, storage.API_SECRET]);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="mt-4">
      <label
        htmlFor="currency"
        className="block text-sm font-medium text-gray-700 dark:text-gray-400">
        Default Currency
      </label>
      <input
        value={currency}
        onChange={e => setCurrency(e.target.value)}
        className="p-2 w-full border rounded border-gray-800"
        id="currency"
      />
      <div className="mt-3">
        <button
          className="px-4 py-2 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-800 hover:bg-opacity-80 dark:hover:bg-opacity-80 text-xl rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          onClick={changeCurrency}
          disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Update'}
        </button>
      </div>
    </div>
  );
};

export default General;
