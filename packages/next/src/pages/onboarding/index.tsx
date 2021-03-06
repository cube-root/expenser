import Image from 'next/image';
import { useState, useEffect, Fragment } from 'react';
import Link from 'next/link';
import {
  ChevronRightIcon,
  DuplicateIcon,
  InformationCircleIcon,
  SparklesIcon,
} from '@heroicons/react/outline';
import { getFirebaseConfig } from '../../helper';
import withUser from '../../wrapper/check-user';
import { Dialog, Transition } from '@headlessui/react';

function Modal() {
  const [open, setOpen] = useState(true);

  return (
    <>
      <button
        className="bg-slate-900 p-1 rounded-full dark:bg-slate-400"
        onClick={() => setOpen(!open)}>
        <InformationCircleIcon className="h-6 w-6 text-white dark:text-slate-800" />
      </button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full text-center sm:p-0 px-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                <Dialog.Panel className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 max-w-4xl w-full">
                  <iframe
                    src="https://www.youtube.com/embed/U6HvujR77Tc"
                    title="My expense onboarding'"
                    className="aspect-video w-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen></iframe>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

const OnBoarding = ({ darkMode }: { darkMode: boolean }) => {
  const { CLIENT_EMAIL: emailAddress } = getFirebaseConfig();
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
  }, [copied]);

  return (
    <div className="bg-white h-screen w-full dark:bg-slate-900 relative">
      <div className="flex flex-col items-center px-4 justify-around space-y-4 text-slate-900 dark:text-slate-100 max-w-4xl mx-auto h-full">
        <div className="py-6">
          <Image
            src={darkMode ? '/logo/straight-white.svg' : '/logo/straight.svg'}
            alt="logo"
            width={150}
            height={50}
          />
        </div>
        <div className="flex flex-col flex-auto justify-center text-center max-w-lg">
          <h2 className="text-2xl mb-4">
            Create a new Google sheet and share with email below
          </h2>
          <div className="relative mx-auto w-full">
            <input
              value={emailAddress}
              disabled={true}
              className="border border-slate-800 rounded-md bg-slate-50 px-2 pt-2 pb-6 w-full text-center dark:text-slate-800 text-ellipsis"
            />
            <div className="absolute top-10 inset-x-0 flex justify-center">
              <button
                className="flex items-center px-4 py-1 space-x-2 rounded-full bg-slate-800 text-white"
                onClick={() => {
                  navigator.clipboard.writeText(emailAddress);
                  setCopied(true);
                }}>
                <DuplicateIcon className="h-4 w-4" />
                <span>{copied ? 'Copied to clipboard' : 'Copy email id'}</span>
              </button>
            </div>
            <div className="mt-16">
              <Image
                src={darkMode ? '/images/arrow-white.svg' : '/images/arrow.svg'}
                alt="arrow"
                width={80}
                height={80}
              />
            </div>
            <Link href={'https://sheet.new/'} passHref>
              <a
                target="_blank"
                className="relative inline-flex items-center space-x-2 justify-center bg-green-50 border border-green-600 hover:bg-green-100 rounded-full px-6 py-4">
                <SparklesIcon className="h-6 w-6 text-green-600 absolute -left-2 -top-1" />
                <Image
                  src={'/images/gsheet-icon.png'}
                  alt="arrow"
                  width={28}
                  height={28}
                />
                <span className="text-xl text-green-600">
                  Create a new sheet
                </span>
              </a>
            </Link>
            <small className="text-xs text-slate-700 block mt-2 dark:text-slate-400">
              <b>NOTE:</b> Login Google drive with same email used to login.
            </small>
            <div className="mt-4">
              <Image
                src={darkMode ? '/images/arrow-white.svg' : '/images/arrow.svg'}
                alt="arrow"
                className="-scale-x-100"
                width={80}
                height={80}
              />
            </div>
            <h2 className="text-xl">Copy the sheet link and proceed</h2>
          </div>
        </div>
        <div className="flex items-center justify-center space-x-2 py-12">
          <Modal />
          <Link href={'/onboarding/connect'}>
            <a className="flex items-center justify-center space-x-2 bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-800 px-4 py-2 rounded-full">
              <span>Next Step</span>
              <ChevronRightIcon className="h-4 w-4" />
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default withUser(OnBoarding);
