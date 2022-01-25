import { useRouter } from 'next/router';
import Header from '../../components/header';
import ChangeSpreadSheet from '../../components/spreadsheet-id';


const ChangeSpreadSheetId = () => {
    const router = useRouter();

    const callBack = (spreadSheetId: String) => {
        if (spreadSheetId) {
            router.push('/home');
        }
    }
    return (
        <div>
            <Header />
            <div className='pt-10'>
                <ChangeSpreadSheet
                    setSpreadSheetLinkCallBack={(id: String) => { callBack(id) }}
                />
            </div>
        </div>
    )
}


export default ChangeSpreadSheetId;