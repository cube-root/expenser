import { ClockIcon } from '@heroicons/react/outline';

const CardWrapper = ({ children }: { children: any }) => {
  return (
    <>
      <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide mt-4">
        History
      </h2>
      <ul
        role="list"
        className="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </ul>
    </>
  );
};
const CardChild = ({
  key,
  heading,
  amount,
  date,
  description,
  currency,
  // bgColor = 'bg-cyan-600',
  startOf,
  onClickDelete,
  disableDeleteButton = false
}: {
  key: any;
  heading?: string;
  amount?: string;
  date?: string;
  description?: string;
  currency?: string;
  meta?: any;
  bgColor?: string;
  Icon?: any;
  startOf?: string;
  onClickDelete?: any
  disableDeleteButton?: any
}) => {
  return (
    <li
      key={key ? key : new Date().getTime()}
      className="col-span-1 flex justify-between items-start shadow-sm rounded-md bg-slate-50 dark:bg-slate-700 p-4 border-l-4 border-red-600">
      <div className="flex-auto">
        <p className="dark:text-white">{heading}</p>
        <p className="text-2xl font-medium my-1 dark:text-white">
          {currency} {amount}
        </p>
        <p className="text-slate-500 dark:text-slate-200 text-sm mb-2">
          {description}
        </p>
        <p className="text-slate-400 dark:text-slate-300 text-sm">{date}</p>
        <p className='mt-2'>
          <button
            key={key}
            className='border-2 text-slate-400 dark:text-slate-300 text-sm rounded-md p-2'
            disabled={disableDeleteButton}
            onClick={() => {
              if (onClickDelete) onClickDelete();
            }}
          >
            Delete
          </button>
        </p>
      </div>
      <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-200">
        <ClockIcon className="h-4 w-4" aria-hidden="true" />
        <p>{startOf}</p>
      </div>
    </li>
  );
};
const Card = {
  CardWrapper,
  CardChild,
};

export default Card;
