import { useState } from 'react';
// import { RadioGroup } from '@headlessui/react';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

const ButtonGroup = (props: {
  onClickFilter: (id: string) => void;
}) => {
  const [active] = useState(false);
  return (
    <span className="isolate inline-flex rounded-md shadow-sm">
      <button
        type="button"
        onClick={() => {
          props.onClickFilter('all')
        }}
        className={classNames(
          'relative inline-flex items-center rounded-l-md border border-gray-300  px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50',
          active ? 'bg-slate-200' : 'bg-white',
        )}>
        All
      </button>
      <button
        type="button"
        onClick={() => {
          props.onClickFilter('today')
        }}
        className={classNames(
          'relative -ml-px inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50',
          active ? 'bg-slate-200' : 'bg-white',
        )}>
        Today
      </button>
      <button
        type="button"
        onClick={() => {
          props.onClickFilter('last-seven')
        }}
        className={classNames(
          'relative -ml-px inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50',
          active ? 'bg-slate-200' : 'bg-white',
        )}>
        Last 7 days
      </button>
      {/* <button
        type="button"
        className={classNames(
          'relative -ml-px inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50',
          active ? 'bg-slate-200' : 'bg-white',
        )}>
        Last Week
      </button>
      <button
        type="button"
        className={classNames(
          'relative -ml-px inline-flex items-center rounded-r-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50',
          active ? 'bg-slate-200' : 'bg-white',
        )}>
        Last Month
      </button> */}
    </span>
  );
}

export default ButtonGroup;