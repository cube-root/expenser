import withSidebar from '../../wrapper/sidebar';
import withUser from '../../wrapper/user';
import useSheets from '../../hooks/sheets';
import AddExpenseCard from '../../components/cards/add-expense';
import TelegramIntegrationCard from '../../components/cards/telegram-integration';
import ConnectSheetCard from '../../components/cards/connect-sheet';
const Home = () => {
  const [sheets] = useSheets();
  return (
    <div className="flex flex-col flex-auto">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sheets.isSheetConnected ? (
              <>
                <AddExpenseCard />
                <TelegramIntegrationCard />
              </>
            ) : (
              <ConnectSheetCard />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withSidebar(withUser(Home));
