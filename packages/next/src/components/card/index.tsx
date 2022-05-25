import { ClockIcon } from '@heroicons/react/outline';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

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
  bgColor = 'bg-cyan-600',
  startOf,
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
}) => {
  return (
    <li
      key={key}
      className="col-span-1 flex justify-between items-start shadow-sm rounded-md font-mono bg-slate-50 p-4 border-l-4 border-red-600">
      <div className="flex-auto">
        <p>{heading}</p>
        <p className="text-2xl font-medium my-1">
          {currency} {amount}
        </p>
        <p className="text-gray-500 text-sm mb-2">{description}</p>
        <p className="text-gray-400 text-sm">{date}</p>
      </div>
      <div className="flex items-center space-x-1 text-slate-500">
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
