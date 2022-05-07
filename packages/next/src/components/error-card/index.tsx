import { XCircleIcon } from '@heroicons/react/solid';

type listArray = {
  label: string;
};
type inputProp = {
  title: string;
  list: Array<listArray> | [];
};
const ErrorCard = (props: inputProp) => {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium font-mono text-red-800">
            {props.title}
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <ul role="list" className="list-disc pl-5 space-y-1">
              {props.list &&
                props.list.map((item: listArray, index: any) => {
                  return (
                    <li className="font-mono" key={index}>
                      {item}
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorCard;
