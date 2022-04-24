import { useRouter } from 'next/router';
import ChangeSpreadSheet from '../../components/spreadsheet-id';
import SideBar from '../../components/sidebar';

type FirebaseConfigType = {
  FIREBASE_API_KEY: string | any;
  FIREBASE_AUTH_DOMAIN: string | any;
  PROJECT_ID: string | any;
  STORAGE_BUCKET: string | any;
  MESSAGING_SENDER_ID: string | any;
  APP_ID: string | any;
};

const ChangeSpreadSheetId = (props: { firebaseConfig: FirebaseConfigType }) => {
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
                  firebaseConfig={props.firebaseConfig}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export async function getServerSideProps() {
  return {
    props: {
      firebaseConfig: {
        FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
        FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
        PROJECT_ID: process.env.PROJECT_ID,
        STORAGE_BUCKET: process.env.STORAGE_BUCKET,
        MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
        APP_ID: process.env.APP_ID,
      },
    }, // will be passed to the page component as props
  };
}

export default ChangeSpreadSheetId;
