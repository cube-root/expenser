import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useState } from 'react';
import SheetSettingTabs from '../../components/sheet-settings';
import SideBar from '../../components/sidebar';
import helper from '../../helper';
import UseStorage from '../../hooks/get-data';

const SheetSettings = () => {
    const router = useRouter();
    const [newData, setData] = useState<any>({});
    const { data } = UseStorage(helper.getFirebaseConfig());
    const callBack = (sheetId: string,sheetLink:string) => {
        if (sheetId) {
            setData({
                ...newData,
                sheetId,
                sheetLink
            })
            router.push('/home');
        }
    };
    useEffect(() => {
        setData({ ...data });
    }, [data])
 
    console.log(data);
    return (<>
        <SideBar>
            <SheetSettingTabs
                currentSheetLink={newData.sheetLink}
                sheetId={newData.sheetId}
                sheetLink={newData.sheetLink}
                firebaseConfig={helper.getFirebaseConfig()}
                callBack={callBack}
            />
        </SideBar>
    </>)
}

export default SheetSettings