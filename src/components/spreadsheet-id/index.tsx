import { NextPage } from "next";
import { useRef } from 'react';
import { useRouter } from 'next/router';

type Props = {
    setSpreadSheetLinkCallBack: Function
}
const SetSpreadSheetId = ({setSpreadSheetLinkCallBack=()=>{}}:Props) => {
    const spreadSheetLink = useRef('');
    const router = useRouter();

    const setSpreadSheetLink = () => {
        if (window && spreadSheetLink.current.length !== 0) {
            window.localStorage.setItem('spreadSheetLink', spreadSheetLink.current);
            setSpreadSheetLinkCallBack();
        }
    }


    return (
        <div className="flex flex-col items-center  align-middle gap-4">
            <div className="border rounded-lg border-solid border-black">
                <button className="p-8">Create new spread sheet</button>
            </div>
            <div className=" flex flex-col  border rounded-lg border-solid border-black mt-10 items-center">
                <div className=" m-5 p-4 ">
                    <input
                        className="p-8 border rounded border-black"
                        type="text"
                        placeholder="Paste Spread Sheet Link here"
                        onChange={(event) => {
                            spreadSheetLink.current = event.target.value
                        }}
                    />
                </div>
                <div className="m-5 p-5">
                    <button
                        className="p-8 border rounded border-black hover:bg-black hover:text-white"
                        onClick={() => { setSpreadSheetLink() }}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}


export default SetSpreadSheetId