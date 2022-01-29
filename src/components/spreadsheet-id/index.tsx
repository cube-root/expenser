import { NextPage } from "next";
import { useRef } from 'react';
import { useRouter } from 'next/router';
import helper from '../../helper';
import Header from "../header";

type Props = {
    setSpreadSheetLinkCallBack?: Function
}
const SetSpreadSheetId = ({ setSpreadSheetLinkCallBack = () => { } }: Props) => {
    const spreadSheetLink = useRef('');
    const router = useRouter();

    const setSpreadSheetLink = () => {
        if (window && spreadSheetLink.current.length !== 0) {
            window.localStorage.setItem('spreadSheetLink', spreadSheetLink.current);
            window.localStorage.setItem('spreadSheetId', helper.extractSheet(spreadSheetLink.current));
            setSpreadSheetLinkCallBack(helper.extractSheet(spreadSheetLink.current));
        }
    }


    return (
        <div className="flex flex-col items-center justify-center  pt-10 w-auto">
            <div className="border rounded-lg border-solid border-white">
                <button className="p-8 font-mono text-white">Create new sheet</button>
            </div>
            <div className=" flex flex-col  border rounded-lg border-solid border-white mt-10 items-center ">
                <label className="text-white font-mono text-lg pt-10">Paste sheet link here</label>
                <div className=" p-5 m-5  ">
                    <input
                        className="p-8 border rounded border-white font-mono "
                        type="text"
                        placeholder="Paste Spread Sheet Link here"
                        onChange={(event) => {
                            spreadSheetLink.current = event.target.value
                        }}
                    />
                </div>
                <div className="m-5 p-5">
                    <button
                        className="p-4 border rounded-3xl border-white text-white hover:text-black hover:bg-white font-mono"
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