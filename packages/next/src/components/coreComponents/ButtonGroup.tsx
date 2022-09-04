import { useState } from 'react';
// import { RadioGroup } from '@headlessui/react';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function ButtonGroup() {
  const [active] = useState(false);
  return (
    <span className="isolate inline-flex rounded-md shadow-sm">
      <button
        type="button"
        className={classNames(
          'relative inline-flex items-center rounded-l-md border border-gray-300  px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50',
          active ? 'bg-slate-200' : 'bg-white',
        )}>
        Today
      </button>
      <button
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
      </button>
    </span>
  );
}
