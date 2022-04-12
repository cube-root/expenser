import { useRouter } from 'next/router';
import ChangeSpreadSheet from '../../components/spreadsheet-id';
import SideBar from '../../components/sidebar';

const ChangeSpreadSheetId = () => {
  const router = useRouter();

  const callBack = (spreadSheetId: string) => {
    if (spreadSheetId) {
      router.push('/home');
    }
  };
  return (
    <div>
      <SideBar />
      <div className="md:pl-72 flex flex-col flex-1  h-screen overflow-y-auto bg-gray-900 no-scrollbar">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl  text-white font-mono">Sheet Settings</h1>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="py-4 ">
              <div className="md:border-4 bg-black md:border-dashed md:border-gray-200 rounded-lg h-auto pb-10">
                <ChangeSpreadSheet
                  setSpreadSheetLinkCallBack={(id: string) => {
                    callBack(id);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeSpreadSheetId;
