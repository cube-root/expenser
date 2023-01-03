import { useRouter } from 'next/router';
import { PlusCircleIcon } from '@heroicons/react/outline';
import Image from 'next/image';

const TelegramIntegrationCard = () => {
  const router = useRouter();
  return (
    <div className="rounded-md bg-blue-600/20 dark:text-white px-4 py-6">
      <div className="flex space-x-4 mb-4 sm:justify-center">
        <Image
          src="/images/telegram_logo.png"
          alt="currencies"
          width={120}
          height={50}
          objectFit="contain"
        />
        <h3 className="text-xl mt-4 mb-6">
          You can add expenses from telegram !!
        </h3>
      </div>
      <button
        className="rounded-full flex items-center space-x-2 bg-slate-900 w-full justify-center mx-auto sm:w-auto text-white px-4 py-2"
        onClick={() => {
          // router.push('/integrations');
          window.open('https://t.me/expenser_scheduler_bot', '_blank');
        }}>
        <span className="text-base">Open Telegram Bot</span>
      </button>
    </div>
  );
};

export default TelegramIntegrationCard;
