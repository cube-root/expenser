import { useRouter } from 'next/router';
import {
  PlusCircleIcon,
} from '@heroicons/react/outline';
import Image from 'next/image';

const AddExpenseCard = () => {
  const router = useRouter();
  return (
    <div className="rounded-md bg-green-600/20 px-4 py-6 text-center dark:text-white">
      <Image
        src="/images/currency symbols.png"
        alt="currencies"
        width={120}
        height={50}
        objectFit="contain"
      />
      <h3 className="text-lg mt-4 mb-6">Add an expense to get started</h3>
      <button
        className="rounded-full flex items-center space-x-2 bg-green-700 mx-auto text-white px-4 py-2"
        onClick={() => {
          router.push('/add-expense');
        }}>
        <PlusCircleIcon className="h-5 w-5" aria-hidden="true" />
        <span className="text-lg">Add an expense</span>
      </button>
    </div>
  );
};

export default AddExpenseCard;
