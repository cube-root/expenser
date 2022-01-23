import { NextPage } from "next";
import { useEffect,useState } from "react";
import Header from '../../components/header/index';
import SetSpreadSheetId from "../../components/spreadsheet-id";
import AddExpense from "../add-expense";
const HomePage: NextPage = () => {
    const [spreadSheetLink,setSpreadSheetLink] = useState<any>(null);
    
    useEffect(() => {
        if (global && global.window) {
            const spreadSheetLinkLocal = global.window.localStorage.getItem('spreadSheetLink');
            setSpreadSheetLink(spreadSheetLinkLocal)
        }
    },[spreadSheetLink])
    return (
        <div className="flex flex-col h-screen">
            <Header />
            {(spreadSheetLink === null || !spreadSheetLink )&& (
                <div className="flex-1 overflow-y-auto pt-8 items-center align-middle">
                    {console.log('in')}
                    <SetSpreadSheetId setSpreadSheetLinkCallBack={setSpreadSheetLink} />
                </div>
            )}
            {spreadSheetLink && (
                <AddExpense />
            )}
        </div>
    )
}

export default HomePage