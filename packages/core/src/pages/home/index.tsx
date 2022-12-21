import withSidebar from '../../wrapper/sidebar';
import withUser from '../../wrapper/user';
const Home = () => {
  return <div>Home</div>;
};

export default withSidebar(withUser(Home));
