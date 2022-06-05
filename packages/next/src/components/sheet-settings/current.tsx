type inputProps = {
  currentSheetLink?: string;
  sheetLink?: string;
  sheetId?: string;
};

const Current = (props: inputProps) => {
  return (
    <div className="mt-12">
      <dl className="divide-y divide-gray-200 text-gray-800 dark:text-gray-300">
        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
          <dt className="text-sm font-medium">Current Sheet Link</dt>
          <dd className="mt-1 flex text-sm sm:mt-0 sm:col-span-2">
            <span className="flex-grow">
              <a
                target={'_blank'}
                rel="noreferrer"
                href={props.currentSheetLink ? props.currentSheetLink : '#'}>
                {props.sheetId}
              </a>
            </span>
            <span className="ml-4 flex-shrink-0">
              <a
                target={'_blank'}
                rel="noreferrer"
                href={props.currentSheetLink ? props.currentSheetLink : '#'}
                className="rounded-md font-medium text-green-600 hover:text-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Open Sheet
              </a>
            </span>
          </dd>
        </div>
      </dl>
    </div>
  );
};

export default Current;
