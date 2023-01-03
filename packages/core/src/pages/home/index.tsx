import withSidebar from '../../wrapper/sidebar';
import withUser from '../../wrapper/user';
import useUser from '../../hooks/user';
import AddExpenseCard from '../../components/cards/add-expense';
import TelegramIntegrationCard from '../../components/cards/telegram-integration';
const Home = () => {
  const [user] = useUser();
  console.log(user, 'xxx');
  return (
    <div className="flex flex-col flex-auto">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AddExpenseCard />
            <TelegramIntegrationCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default withSidebar(withUser(Home));
