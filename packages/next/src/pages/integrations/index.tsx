import { useEffect, useState } from 'react';
import axios from 'axios';
import SideBar from '../../components/sidebar';
import { toast } from 'react-toastify';
import useUser from '../../hooks/user';
import {
  ClipboardCopyIcon,
  PlusIcon,
  SaveIcon,
} from '@heroicons/react/outline';

type typeResponse = {
  API_KEY: 'string';
  API_SECRET: 'string';
};
const Integrations = () => {
  const [isLoading, setLoading] = useState(false);
  const [copiedkey, setCopiedKey] = useState(false);
  const [copiedsecret, setCopiedSecret] = useState(false);
  const [responseData, setResponseData] = useState<typeResponse | undefined>(
    undefined,
  );
  const [user, setUser] = useUser();
    useEffect(()=>{
      if(copiedkey){
        setTimeout(()=>{
          setCopiedKey(false);
        },3000)
      }
      if(copiedsecret){
        setTimeout(()=>{
          setCopiedSecret(false);
        },3000)
      }
    },[
      copiedkey,
      copiedsecret,
    ])
  const showKeys = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        '/api/v1/integrations/keys',
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.accessToken}`,
          },
        },
      );
      setResponseData(response.data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to get keys');
      toast.info('Please login and try again');
      console.log(error);
    }
    setLoading(false);
  };
  const revokeKeys = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        '/api/v1/integrations/revoke-keys',
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.accessToken}`,
          },
        },
      );
      toast.success('Keys revoked successfully');
      setUser({ ...user, ...response.data });
      setResponseData(response.data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to revoke keys');
      toast.info('Please login and try again');
      console.log(error);
    }
    setLoading(false);
  };
  if (isLoading) {
    return (
      <div>
        <SideBar>
          <div className="flex flex-col items-center justify-center">
            <p className="text-black dark:text-white">
              Loading
              <span className="animate-pulse pl-1 pr-1">...</span>
              Please wait
              <span className="animate-pulse pl-1">!!!</span>
            </p>
          </div>
        </SideBar>
      </div>
    );
  }
  return (
    <>
      <SideBar>
        <div className="ml-5 flex flex-col flex-1  h-screen overflow-y-auto no-scrollbar mt-5 text-gray-800 dark:text-white">
          <div className="flex flex-row gap-3 mt-10">
            <div className=" ">
              <button
                disabled={isLoading}
                className="border rounded-lg p-2"
                onClick={showKeys}>
                Show Keys
              </button>
            </div>

            <div className=" ">
              <button
                disabled={isLoading}
                className="border rounded-lg p-2"
                onClick={revokeKeys}>
                Revoke Keys
              </button>
            </div>
          </div>
          {responseData && (
            <div className="flex flex-col mt-10 gap-7">
              <div className="flex flex-col gap-1 ">
                <div className="font-bold flex flex-row items-center">
                  <span>API KEY :</span>
                  <div className='ml-2'>
                    <button
                      onClick={() => {
                        setCopiedKey(true);
                        navigator.clipboard.writeText(responseData.API_KEY);
                      }}
                      className="px-4 py-2 rounded bg-slate-800 dark:bg-slate-700 hover:bg-opacity-90 dark:hover:bg-opacity-90 text-white  inset-y-0 right-0 rounded-r-md inline-flex items-center justify-center space-x-2">
                      <ClipboardCopyIcon className="h-5 w-5" />
                      <span>{copiedkey ? 'Copied to clipboard' : 'Copy to clipboard'}</span>
                    </button>
                  </div>
                </div>
                <input type="text"
                  value={responseData.API_KEY}
                  disabled
                  className="appearance-none block w-full bg-white text-black border border-gray-500 rounded-md py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white dark:text-black"
                />
              </div>
              <div className="flex flex-col gap-1 ">
                <div className="font-bold flex flex-row items-center">
                  <span>API SECRET :</span>
                  <div className='ml-2'>
                    <button
                      onClick={() => {
                        setCopiedSecret(true);
                        navigator.clipboard.writeText(responseData.API_KEY);
                      }}
                      className="px-4 py-2 rounded bg-slate-800 dark:bg-slate-700 hover:bg-opacity-90 dark:hover:bg-opacity-90 text-white  inset-y-0 right-0 rounded-r-md inline-flex items-center justify-center space-x-2">
                      <ClipboardCopyIcon className="h-5 w-5" />
                      <span>{copiedsecret ? 'Copied to clipboard' : 'Copy to clipboard'}</span>
                    </button>
                  </div>
                </div>
                <input type="text"
                  value={responseData.API_SECRET}
                  disabled
                  className="appearance-none block w-full bg-white text-black border border-gray-500 rounded-md py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white dark:text-black"
                />
              </div>
            </div>
          )}
        </div>
      </SideBar>
    </>
  );
};

export default Integrations;
