import SideBar from '../components/sidebar';

const withSidebar = (Component: any) => {
  const Wrapper = (props: any) => {
    return (
      <SideBar>
        <Component {...props} />
      </SideBar>
    );
  };
  return Wrapper;
};

export default withSidebar;
