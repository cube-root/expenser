import Image from 'next/image';
import Link from 'next/link';
import { ChevronRightIcon, SparklesIcon } from '@heroicons/react/outline';
import withUser from '../../wrapper/check-user';
import VideoModal from '../../components/VideoModal';

const OnBoarding = ({ darkMode }: { darkMode: boolean }) => {
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
          <h2 className="text-2xl mb-4 mt-24">
            Create a new Google sheet and share with email below
          </h2>
          <div className="relative mx-auto w-full">
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
              <b>NOTE:</b> Login to Google with same email used for MyExpense.
            </small>
            <div className="mt-24">
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
          <Link href={'/onboarding'}>
            <a className="flex items-center justify-center space-x-2 text-slate-400 px-4 py-2 rounded-full">
              <ChevronRightIcon className="h-4 w-4 transform rotate-180" />
              <span>Back</span>
            </a>
          </Link>
          <VideoModal src="https://www.youtube.com/embed/U6HvujR77Tc?autoplay=1&controls=0&start=3&modestbranding=1" />
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
