import { useRef, useState } from 'react';
import helper from '../../helper';
import SheetStorage from '../../hooks/sheet-storage';

const Create = ({
    setSpreadSheetLinkCallBack = () => undefined,
    firebaseConfig
}: {
    setSpreadSheetLinkCallBack: any,
    firebaseConfig: any
}) => {
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
            setSpreadSheetLinkCallBack(helper.extractSheet(spreadSheetLink.current), spreadSheetLink.current);
        }
    };

    return (
        <div className="mt-10 divide-y divide-gray-200">
            <div className=''>Steps:</div>
            <div className='flex flex-col'>
                <div className='mt-10'>
                    <div className='font-bold text-xl'>1.Copy the email</div>
                    <div className='text-sm text-gray-500'>Please share this email with the sheet</div>
                    <div className="mt-2 border p-2 font-bold font-mono">{process.env.CLIENT_EMAIL}</div>
                </div>
                <div className='mt-5'>
                    <div className='font-bold text-xl'>2.Create new sheet</div>
                    <div className='text-sm text-gray-500'>Click the button to create. NOTE: Login Google drive with same email given here.</div>
                    <dl className="mt-5 ml-4 divide-y divide-gray-200">
                        <a
                            href='https://sheets.new'
                            type="button"
                            target={'_blank'}
                            className="border border-black bg-white p-2 text-purple-600 hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                            rel="noreferrer"
                        >
                            Create New Sheet
                        </a>
                    </dl>
                </div>
                <div className='mt-8'>
                    <div className='font-bold text-xl'>3.Paste the sheet id here</div>
                    <div className='mt-2'>
                        <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                            Paste sheet link here
                        </label>
                        <input
                            className="p-2 border rounded border-black w-full font-mono "
                            type="text"
                            placeholder="Paste Spread Sheet Link here"
                            onChange={event => {
                                spreadSheetLink.current = event.target.value;
                            }}
                        />
                    </div>
                    <div className='mt-2'>
                        <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                            Choose a name
                        </label>
                        <input
                            className="p-2 w-full border rounded border-black font-mono "
                            type="text"
                            placeholder="Please choose a name for sheet"
                            onChange={event => {
                                name.current = event.target.value;
                            }}
                        />
                    </div>
                    <div className='mt-3 ml-4'>
                        <button
                            disabled={isCreating}
                            onClick={setSpreadSheetLink}
                            className="border border-black bg-white p-2 text-purple-600 hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"

                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Create