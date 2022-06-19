import { Fragment, useState, useEffect } from 'react';
import { Dialog, Menu, Transition } from '@headlessui/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import {
  CogIcon,
  HomeIcon,
  MenuAlt1Icon,
  XIcon,
} from '@heroicons/react/outline';
import {
  DocumentAddIcon,
  ClipboardListIcon,
  PuzzleIcon,
} from '@heroicons/react/outline';
import { ChevronDownIcon } from '@heroicons/react/solid';
import useUser from '../../hooks/user';

const navigation: any = [
  {
    name: 'Home',
    href: '/home',
    icon: HomeIcon,
    current: true,
  },
  {
    name: 'Add Expense',
    href: '/add-expense',
    icon: DocumentAddIcon,
    current: false,
  },
  {
    name: 'View',
    href: '/get-expense',
    icon: ClipboardListIcon,
    current: false,
  },
];
const secondaryNavigation: Array<any> = [
  {
    name: 'Sheets',
    href: '/sheet-settings',
    icon: CogIcon,
    current: true,
  },
  {
    name: 'Integrations',
    href: '/integrations',
    icon: PuzzleIcon,
  },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function SideBar({
  children = null,
  darkMode,
}: {
  children?: any;
  darkMode?: boolean;
}) {
  const [data] = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState<any>({});
  const [current, setCurrent] = useState('/home');
  const router = useRouter();
  const changeRoute = (link: any) => {
    router.push(link);
  };
  const onLogout = () => {
    window.localStorage.clear();
    window.location.reload();
  };
  useEffect(() => {
    if (router.pathname) {
      setCurrent(router.pathname);
    }
  }, [router.pathname]);
  useEffect(() => {
    setUserData({
      displayName: data.displayName,
      photoUrl: data.photoUrl,
    });
  }, []);
  const photoUrl =
    userData && userData.photoUrl
      ? userData.photoUrl
      : 'https://img.icons8.com/external-soft-fill-juicy-fish/60/000000/external-five-cute-monsters-soft-fill-soft-fill-juicy-fish.png';
  return (
    <div className="h-screen overflow-auto">
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className={classNames(
            darkMode ? 'dark' : null,
            'relative z-40 lg:hidden',
          )}
          onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 flex z-40">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full">
              <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-slate-50 dark:bg-slate-800">
                <div className="flex-shrink-0 flex items-center justify-center px-4">
                  <Image
                    src="/logo/straight.svg"
                    height={50}
                    width={150}
                    alt=""
                  />
                </div>
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0">
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}>
                      <span className="sr-only">Close sidebar</span>
                      <XIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                <nav
                  className="mt-5 flex-shrink-0 h-full divide-y divide-slate-200 overflow-y-auto"
                  aria-label="Sidebar">
                  <div className="px-2 space-y-1">
                    {navigation.map((item: any) => (
                      <button
                        key={item.name}
                        onClick={() => changeRoute(item.href)}
                        className={classNames(
                          current === item.href
                            ? 'bg-slate-800 text-slate-100 dark:bg-slate-700 dark:text-slate-200'
                            : 'text-slate-800 hover:bg-slate-200 dark:text-slate-100 dark:hover:bg-slate-700/50',
                          'group w-full flex items-center px-2 py-2 text-sm leading-6  rounded-md',
                        )}
                        aria-current={
                          current === item.href ? 'page' : undefined
                        }>
                        <item.icon
                          className="mr-4 flex-shrink-0 h-6 w-6"
                          aria-hidden="true"
                        />
                        {item.name}
                      </button>
                    ))}
                  </div>
                  <div className="mt-6 pt-6">
                    <div className="px-2 space-y-1">
                      {secondaryNavigation.map((item: any) => (
                        <button
                          key={item.name}
                          onClick={() => changeRoute(item.href)}
                          className={classNames(
                            current === item.href
                              ? 'bg-slate-800 text-slate-100 dark:bg-slate-700 dark:text-slate-200'
                              : 'text-slate-800 hover:bg-slate-200 dark:text-slate-100 dark:hover:bg-slate-700/50',
                            'group w-full flex items-center px-2 py-2 text-sm leading-6  rounded-md',
                          )}
                          aria-current={
                            current === item.href ? 'page' : undefined
                          }>
                          <item.icon
                            className="mr-4 h-6 w-6"
                            aria-hidden="true"
                          />
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </nav>
              </div>
            </Transition.Child>
            <div className="flex-shrink-0 w-14" aria-hidden="true">
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex flex-col flex-grow bg-slate-50 dark:bg-slate-800 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0">
            <div className="flex items-center py-5 w-full text-white ">
              <div className="h-10 w-full relative">
                <Image src="/logo/straight.svg" alt="logo" layout="fill" />
              </div>
            </div>
          </div>
          <nav
            className="mt-5 flex-1 flex flex-col divide-y divide-slate-200 dark:divide-slate-900 overflow-y-auto"
            aria-label="Sidebar">
            <div className="px-2 space-y-1">
              {navigation.map((item: any) => (
                <button
                  key={item.name}
                  onClick={() => changeRoute(item.href)}
                  className={classNames(
                    current === item.href
                      ? 'bg-slate-800 text-slate-100 dark:bg-slate-700 dark:text-slate-200'
                      : 'text-slate-800 hover:bg-slate-200 dark:text-slate-100 dark:hover:bg-slate-700/50',
                    'group w-full flex items-center px-2 py-2 text-sm leading-6  rounded-md',
                  )}
                  aria-current={current === item.href ? 'page' : undefined}>
                  <item.icon
                    className="mr-4 flex-shrink-0 h-6 w-6"
                    aria-hidden="true"
                  />
                  {item.name}
                </button>
              ))}
            </div>
            <div className="mt-6 pt-6">
              <div className="px-2 space-y-1">
                {secondaryNavigation.map((item: any) => (
                  <button
                    key={item.name}
                    onClick={() => changeRoute(item.href)}
                    className={classNames(
                      current === item.href
                        ? 'bg-slate-800 text-slate-100 dark:bg-slate-700 dark:text-slate-200'
                        : 'text-slate-800 hover:bg-slate-200 dark:text-slate-100 dark:hover:bg-slate-700/50',
                      'group w-full flex items-center px-2 py-2 text-sm leading-6  rounded-md',
                    )}
                    aria-current={current === item.href ? 'page' : undefined}>
                    <item.icon className="mr-4 h-6 w-6" aria-hidden="true" />
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </div>
      </div>

      <div className="lg:pl-64 flex flex-col flex-auto h-screen">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 lg:border-none dark:bg-gray-800 dark:border-gray-800">
          <button
            type="button"
            className="px-4 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-900 lg:hidden"
            onClick={() => setSidebarOpen(true)}>
            <span className="sr-only">Open sidebar</span>
            <MenuAlt1Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          {/* Search bar */}
          <div className="flex-1 px-4 flex justify-between sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
            <div className="flex-1 flex"></div>
            <div className="ml-4 flex items-center md:ml-6">
              {/* Profile dropdown */}
              <Menu as="div" className="ml-3 relative">
                <div>
                  <Menu.Button className="max-w-xs bg-white dark:bg-slate-900 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 lg:p-2 lg:rounded-md lg:hover:bg-gray-50 dark:lg:hover:bg-gray-900">
                    <img
                      className="h-8 w-8 rounded-full"
                      src={photoUrl}
                      alt=""
                    />
                    <span className="hidden ml-3 text-gray-700 dark:text-slate-300 text-sm  lg:block">
                      <span className="sr-only">Open user menu for </span>
                      {userData.displayName}
                    </span>
                    <ChevronDownIcon
                      className="hidden flex-shrink-0 ml-1 h-5 w-5 text-gray-400 dark:text-slate-300 lg:block"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95">
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={onLogout}
                          className={classNames(
                            active ? 'bg-gray-100' : '',
                            'block px-4 py-2 text-sm text-gray-700 w-full',
                          )}>
                          Logout
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
        {/* className="flex-1 pb-8" */}
        <div className="flex-auto bg-white dark:bg-slate-900 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
