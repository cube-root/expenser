import { useRef, useState } from 'react';
import helper from '../../helper';
import SheetStorage from '../../hooks/sheet-storage';

const Update = ({
  setSpreadSheetLinkCallBack,
  firebaseConfig,
}: {
  setSpreadSheetLinkCallBack: any;
  firebaseConfig: any;
}) => {
  const [isCreating, setCreating] = useState(false);
  const [, setStorageData] = SheetStorage();
  const spreadSheetLink = useRef('');
  const name = useRef('');
  const setSpreadSheetLink = async () => {
    setCreating(true);
    if (spreadSheetLink.current.length !== 0) {
      await setStorageData({
        spreadSheetLink: spreadSheetLink.current,
        spreadSheetId: helper.extractSheet(spreadSheetLink.current),
        firebaseConfig,
        name: name.current,
      });
      await setSpreadSheetLinkCallBack(
        helper.extractSheet(spreadSheetLink.current),
        spreadSheetLink.current,
      );
    }
    setCreating(false);
  };
  return (
    <div className="mt-10 divide-y divide-gray-200">
      <div className="flex flex-col">
        <div className="mt-2">
          <label
            htmlFor="first-name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            Paste sheet link here
          </label>
          <input
            className="p-2 border rounded border-gray-800 w-full"
            type="text"
            placeholder="Paste Spread Sheet Link here"
            onChange={event => {
              spreadSheetLink.current = event.target.value;
            }}
          />
        </div>
        <div className="mt-2">
          <label
            htmlFor="first-name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            Choose a name
          </label>
          <input
            className="p-2 w-full border rounded border-gray-800"
            type="text"
            placeholder="Please choose a name for sheet"
            onChange={event => {
              name.current = event.target.value;
            }}
          />
        </div>
        <div className="mt-4">
          <button
            disabled={isCreating}
            onClick={setSpreadSheetLink}
            className="px-4 py-2 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-800 hover:bg-opacity-80 dark:hover:bg-opacity-80 text-xl rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Update;
