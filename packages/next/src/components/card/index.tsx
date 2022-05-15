function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

const CardWrapper = ({ children }: { children: any }) => {
  return (
    <div>
      <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide">History</h2>
      <ul role="list" className="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {children}
      </ul>
    </div>
  )
}
const CardChild = ({
  key,
  heading,
  amount,
  date,
  description,
  currency,
  bgColor = 'bg-cyan-600',
  startOf
}: {
  key: any
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
    <li key={key} className="col-span-1 flex shadow-sm rounded-md font-mono">
      <div
        className={classNames(
          bgColor,
          'flex-shrink-0 flex items-center justify-center w-24 text-white text-sm font-medium rounded-l-md'
        )}
      >
        <div className="m-2">
          {startOf}
        </div>
      </div>
      <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
        <div className="flex-1 px-4 py-2 text-sm truncate">
          <p>{heading}</p>
          <p>{amount} {currency}</p>
          <p className="text-gray-500">{description}</p>
          <p>{date}</p>
        </div>

      </div>
    </li>
  )
}
const Card = {
  CardWrapper,
  CardChild
}

export default Card;