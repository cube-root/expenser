import {useRouter} from 'next/router';
import ChangeSpreadSheet from '../../components/spreadsheet-id';


const ChangeSpreadSheetId = () => {
    const router = useRouter();

    const callBack = (spreadSheetId: String) => {
        if(spreadSheetId){
            router.push('/home');
        }    
    }
    return (
        <div>
            <ChangeSpreadSheet
                setSpreadSheetLinkCallBack={(id: String) => { callBack(id) }}
            />
        </div>
    )
}


export default ChangeSpreadSheetId;