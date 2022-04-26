import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import helper from '../../helper';
import SheetStorage from '../../hooks/sheet-storage';
import UseAccessToken from '../../hooks/access-token';
import { toast } from 'react-toastify';

type CallBackFunction = (val: string) => any;
type Props = {
  setSpreadSheetLinkCallBack?: CallBackFunction;
  firebaseConfig: any;
};

const SetSpreadSheetId = ({
  setSpreadSheetLinkCallBack = () => undefined,
  firebaseConfig
}: Props) => {
  const spreadSheetLink = useRef('');
  const [isCreating, setCreating] = useState(false);
  const router = useRouter();
  const [storageData,setStorageData] = SheetStorage();
  const [setToken,getAccessToken] = UseAccessToken();

  const setSpreadSheetLink = () => {
    if (window && spreadSheetLink.current.length !== 0) {
      setStorageData({
        spreadSheetLink: spreadSheetLink.current,
        spreadSheetId: helper.extractSheet(spreadSheetLink.current),
        firebaseConfig
      });
      setSpreadSheetLinkCallBack(helper.extractSheet(spreadSheetLink.current));
    }
  };
  const createNewSheet = async () => {
    setCreating(true);
    const accessToken = getAccessToken();
    try {
      const response = await axios.post(
        '/api/sheets/create',
        {
          accessToken,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (
        response &&
        response.data &&
        response.data.status &&
        response.data.data
      ) {
        setStorageData({
          spreadSheetLink: response.data.data.spreadsheetUrl,
          spreadSheetId: response.data.data.spreadsheetId,
          firebaseConfig
        });
        toast.success('Sheet created successfully');
        router.push('/home');
      } else {
        toast.error('Something went wrong');
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center  pt-10 w-auto">
      <div className="border rounded-lg border-solid border-white text-white  hover:bg-white hover:text-black">
        <button
          disabled={isCreating}
          onClick={() => {
            createNewSheet();
          }}
          className="p-8 font-mono"
        >
          {isCreating ? 'Creating...' : 'Create New Sheet'}
        </button>
      </div>
      <div className=" flex flex-col  border rounded-lg border-solid border-white mt-10 items-center ">
        <label className="text-white font-mono text-lg pt-10">
          Paste sheet link here
        </label>
        <div className=" p-5 m-5  ">
          <input
            className="p-8 border rounded border-white font-mono "
            type="text"
            placeholder="Paste Spread Sheet Link here"
            onChange={event => {
              spreadSheetLink.current = event.target.value;
            }}
          />
        </div>
        <div className="m-5 p-5">
          <button
            disabled={isCreating}
            className="p-4 border rounded-3xl border-white text-white hover:text-black hover:bg-white font-mono"
            onClick={() => {
              setSpreadSheetLink();
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetSpreadSheetId;
