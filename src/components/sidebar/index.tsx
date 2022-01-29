/* eslint-disable @next/next/no-img-element */
import { Fragment, useState } from 'react'
import { useRouter } from 'next/router'
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image'
import {
    HomeIcon,
    MenuIcon,
    DocumentAddIcon,
    XIcon,
    CogIcon,
    ClipboardListIcon
} from '@heroicons/react/outline'
import { useEffect } from 'react';
import hooks from '../../hooks';
const classNames = (...classes: any) => {
    return classes.filter(Boolean).join(' ')
}

const navigation = [
    { name: 'Home', href: '/home', icon: HomeIcon, current: true },
    { name: 'Add Expense', href: '/add-expense', icon: DocumentAddIcon, current: false },
    { name: 'View', href: '/get-expense', icon: ClipboardListIcon, current: false },
    { name: 'Sheets', href: '/change-spread-sheet', icon: CogIcon, current: false }
    // { name: 'Reports', href: '#', icon: ChartBarIcon, current: false },
]



const SideBar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userData, setUserData] = useState<any>({});
    const [current, setCurrent] = useState('/home');
    const router = useRouter();
    const data = hooks.GetStorageData();
    const changeRoute = (link: any) => {
        router.push(link);
    }
    useEffect(() => {
        if (router.pathname) {
            setCurrent(router.pathname);
        }
    }, [router.pathname])
    useEffect(() => {
        setUserData(data);
    }, [data])
    return (
        <>
            <Transition.Root show={sidebarOpen} as={Fragment}>
                <Dialog as="div" className="fixed inset-0 flex z-40 md:hidden" onClose={setSidebarOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
                    </Transition.Child>
                    <Transition.Child
                        as={Fragment}
                        enter="transition ease-in-out duration-300 transform"
                        enterFrom="-translate-x-full"
                        enterTo="translate-x-0"
                        leave="transition ease-in-out duration-300 transform"
                        leaveFrom="translate-x-0"
                        leaveTo="-translate-x-full"
                    >
                        <div className="relative flex-1 flex flex-col justify-between max-w-xs w-full bg-black">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-in-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in-out duration-300"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="absolute top-0 right-0 -mr-12 pt-2">
                                    <button
                                        type="button"
                                        className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <span className="sr-only">Close sidebar</span>
                                        <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                    </button>
                                </div>
                            </Transition.Child>
                            <div className='flex flex-col overflow-y-auto pt-5'>
                                <div className='flex flex-col pt-5 h-16 w-full hover:bg-black hover:text-white  text-black  bg-white items-center'>
                                    <p className='text-xl font-mono'>Expenser</p>
                                </div>
                                <div className='flex flex-1 flex-col items-left  w-full px-10 pt-10'>
                                    {navigation.map((item, index) => {
                                        return (
                                            <button onClick={() => changeRoute(item.href)} key={index} className={classNames(current === item.href
                                                ? 'p-4 flex flex-row items-center justify-left border border-cyan rounded-3xl bg-white'
                                                : 'pt-2 pb-2 flex flex-row items-center justify-left '
                                            )}>
                                                <item.icon className='h-10 pr-3' color={current === item.href ? 'black' : 'white'} />
                                                <p className={classNames(current === item.href ? 'font-mono text-black hover:text-green-300' : 'font-mono text-white hover:text-green-300')}>{item.name}</p>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className='flex flex-shrink-0 flex-col bg-white mb-5 rounded-3xl mx-3'>
                                <div className='p-2 mr-4 pl-4 flex flex-row w-full items-center'>
                                    <img
                                        className='inline-block h-10 w-10 rounded-full'
                                        src={
                                            userData.photoUrl ?
                                                userData.photoUrl :
                                                "https://img.icons8.com/external-soft-fill-juicy-fish/60/000000/external-five-cute-monsters-soft-fill-soft-fill-juicy-fish.png"
                                        }
                                        alt='profile'
                                    />
                                    <p className='font-mono pl-4'>Hai, <span>{userData.displayName}</span></p>

                                </div>
                            </div>
                        </div>
                    </Transition.Child>
                    <div className="flex-shrink-0 w-14">{/* Force sidebar to shrink to fit close icon */}</div>
                </Dialog>
            </Transition.Root>
            <div className='hidden md:flex md:flex-col md:w-64 md:fixed md:top-0 md:bottom-0 md:bg-black md:min-h-0 md:overflow-y-auto'>
                <div className='flex flex-col flex-1 pt-8 items-center flex-shrink-0 px-1'>
                    <div className='flex flex-col pt-5 h-16 w-full hover:bg-black hover:text-white  text-black  bg-white items-center'>
                        <p className='text-xl font-mono'>Expenser</p>
                    </div>
                    <div className='flex flex-1 flex-col items-left  w-full px-10 pt-10'>
                        {navigation.map((item, index) => {
                            return (
                                <button onClick={() => changeRoute(item.href)} key={index} className={classNames(current === item.href
                                    ? 'p-4 flex flex-row items-center justify-left border border-cyan rounded-3xl bg-white'
                                    : 'pt-2 pb-2 flex flex-row items-center justify-left '
                                )}>
                                    <item.icon className='h-10 pr-3' color={current === item.href ? 'black' : 'white'} />
                                    <p className={classNames(current === item.href ? 'font-mono text-black hover:text-green-300' : 'font-mono text-white hover:text-green-300')}>{item.name}</p>
                                </button>
                            )
                        })}
                    </div>
                    <div className='flex flex-shrink-0 flex-col bg-white mb-10 rounded-3xl'>
                        <div className='p-2 mr-4 pl-4 flex flex-row w-full items-center'>
                            <img
                                className='inline-block h-10 w-10 rounded-full'
                                src={
                                    userData.photoUrl ?
                                        userData.photoUrl :
                                        "https://img.icons8.com/external-soft-fill-juicy-fish/60/000000/external-five-cute-monsters-soft-fill-soft-fill-juicy-fish.png"
                                }
                                alt='profile'
                            />
                            <p className='font-mono pl-4'>Hai, <span>{userData.displayName}</span></p>
                        </div>
                    </div>

                </div>

            </div>
            <div className='md:pl-64 flex flex-col flex-1'>
                <div className='sticky top-0 md:hidden bg-gray-100 pl-3 pt-3 sm:pl-3 sm:pt-3'>
                    <button className='h-12 w-12' onClick={() => {
                        setSidebarOpen(true);
                    }}>
                        <span className="sr-only">Open sidebar</span>
                        <MenuIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </>
    )
}

export default SideBar  