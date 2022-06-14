import { useState, useEffect } from 'react';
import axios from 'axios';
import useUser from '../../hooks/user';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import {
  SaveIcon,
} from '@heroicons/react/outline';

const General = () => {
  const [isLoading, setLoading] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [currency, setCurrency] = useState<string>('$');
  const [user] = useUser();
  const changeCurrency = async () => {
    try {
      const schema = yup.object().shape({
        currency: yup.string().required().default('$')
      })
      const validData = await schema.validate({ currency });
      setSaving(true);
      await axios.post(
        'api/v1/settings/general',
        {
          defaultCurrency: validData.currency,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api_key': user.API_KEY,
            'x-api_secret': user.API_SECRET,
          },
        },
      );
      toast.info('Currency updated');
      setSaving(false);
    } catch (error: any) {
      if (error.errors) {
        error.errors && error.errors.forEach((err: any) => {
          toast.error(err);
        })
      } else {
        toast.error(error.message);
      }
    }
  };
  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const response = await axios.get('api/v1/settings/general', {
          headers: {
            'Content-Type': 'application/json',
            'x-api_key': user.API_KEY,
            'x-api_secret': user.API_SECRET,
          },
        });
        if (response.data && response.data.defaultCurrency)
          setCurrency(response.data.defaultCurrency);
      } catch (error) {
        // do nothing
      }
      setLoading(false);
    })();
  }, []);
  if (isLoading) {
    return <div className="dark:text-white justify-center mt-4">Loading...!!</div>;
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
        placeholder='$'
        id="currency"
      />
      <div className="mt-3">
        <button
          className="inline-flex justify-center items-center space-x-2 px-4 py-2 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-800 hover:bg-opacity-80 dark:hover:bg-opacity-80 text-xl rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          onClick={changeCurrency}
          disabled={isSaving}>
          <SaveIcon className="h-6 w-6" />
          <span>{isSaving ? 'Saving...' : 'Save'}</span>
        </button>
      </div>
    </div>
  );
};

export default General;
