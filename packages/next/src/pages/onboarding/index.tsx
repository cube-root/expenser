import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CheckIcon,
  ChevronRightIcon,
  DuplicateIcon,
} from '@heroicons/react/outline';
import { getFirebaseConfig } from '../../helper';
import withUser from '../../wrapper/check-user';
import VideoModal from '../../components/VideoModal';

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
                className="flex items-center px-6 py-2 space-x-2 rounded-full bg-green-700 hover:bg-green-600 text-white"
                onClick={() => {
                  navigator.clipboard.writeText(emailAddress);
                  setCopied(true);
                }}>
                {!copied ? (
                  <DuplicateIcon className="h-4 w-4 animate-bounce mt-1" />
                ) : (
                  <CheckIcon className="h-4 w-4" />
                )}
                <span>
                  {copied ? (
                    'Copied to clipboard'
                  ) : (
                    <span className="animate-bounce block mt-2">
                      Copy email id
                    </span>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center space-x-2 py-12">
          <VideoModal src="https://www.youtube.com/embed/U6HvujR77Tc?autoplay=1&controls=0&start=3&modestbranding=1" />
          <Link href={'/onboarding/create-sheet'}>
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
