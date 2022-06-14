import { useState } from 'react';
import axios from 'axios';
import SideBar from '../../components/sidebar';
import { toast } from 'react-toastify';
import useUser from '../../hooks/user';

type typeResponse = {
  API_KEY: 'string';
  API_SECRET: 'string';
};
const Integrations = () => {
  const [isLoading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState<typeResponse | undefined>(
    undefined,
  );
  const [user, setUser] = useUser();

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
                <div className="font-bold">API KEY :</div>
                <div className="mt-2 border  ">{responseData.API_KEY}</div>
              </div>
              <div className="flex flex-col gap-1 ">
                <div className="font-bold">API SECRET :</div>
                <div className="mt-2 border  ">{responseData.API_SECRET}</div>
              </div>
            </div>
          )}
        </div>
      </SideBar>
    </>
  );
};

export default Integrations;
