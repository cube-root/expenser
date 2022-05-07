import { useRef, useState } from 'react';
import helper from '../../helper';
import SheetStorage from '../../hooks/sheet-storage';


type CallBackFunction = (val: string) => any;
type Props = {
  setSpreadSheetLinkCallBack?: CallBackFunction;
  firebaseConfig: any;
  currentSheetLink?: string;
};

const SetSpreadSheetId = ({
  setSpreadSheetLinkCallBack = () => undefined,
  firebaseConfig,
  currentSheetLink,
}: Props) => {
  const spreadSheetLink = useRef('');
  const name = useRef('');
  const [isCreating,] = useState(false);
  const [, setStorageData] = SheetStorage();
  const setSpreadSheetLink = async () => {
    if (spreadSheetLink.current.length !== 0) {
      await setStorageData({
        spreadSheetLink: spreadSheetLink.current,
        spreadSheetId: helper.extractSheet(spreadSheetLink.current),
        firebaseConfig,
        name: name.current,
      });
      setSpreadSheetLinkCallBack(helper.extractSheet(spreadSheetLink.current));
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center  pt-10 w-auto">
      <div className="rounded-lg border-solid border-white text-white  hover:bg-white hover:text-black">
        {/* <button
          disabled={true}
          onClick={() => {
            createNewSheet();
          }}
          className="p-8 font-mono"
        >
          {isCreating ? 'Creating...' : 'Create New Sheet'}
        </button> */}
        Current Sheet: <a rel="noreferrer"  href={currentSheetLink} target="_blank"> {currentSheetLink}</a>
      </div>
      <div className=" flex flex-col  border rounded-lg border-solid border-white mt-10 items-center ">
        <label className="text-white font-mono text-lg pt-10">
          Paste sheet link here
        </label>
        <label className="text-white font-mono text-lg pt-10">
          Please share it with &quot;{process.env.CLIENT_EMAIL}&quot;
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
        <div className=" p-5 m-5  ">
          <input
            className="p-8 border rounded border-white font-mono "
            type="text"
            placeholder="Name for the sheet"
            onChange={event => {
              name.current = event.target.value;
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
