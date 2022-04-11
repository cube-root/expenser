import Link from 'next/link';
import headerConfig from '../../config/header-routes.json';

type HeaderConfigItem = {
  route: any;
  name: string;
};

const Header = () => {
  return (
    <div className="flex w-full h-auto  top-0 bg-black items-center justify-between fixed">
      {headerConfig.map((item: HeaderConfigItem, index: number) => {
        return (
          <div key={index} className="text-white p-2 hover:text-green-900">
            <Link href={item.route}>{item.name}</Link>
          </div>
        );
      })}
    </div>
  );
};

export default Header;
