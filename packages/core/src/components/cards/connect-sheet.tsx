import {
    ChevronRightIcon,
    ClipboardListIcon,
    LinkIcon
  } from '@heroicons/react/outline';
const ConnectSheet = ()=>{
    return (
        <button
                  className="flex items-center justify-between w-full bg-green-600/20 dark:text-slate-50 p-4 space-x-4 text-slate-900 rounded-lg my-4"
                  onClick={() => {
                    // router.push('/get-expense');
                  }}>
                  <LinkIcon className="h-5 w-5" aria-hidden="true" />
                  <span className="text-lg flex-auto text-left">
                    connect your sheet
                  </span>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </button>
    )
}

export default ConnectSheet