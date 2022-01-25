type CardProps = {
    heading ?: String, 
    amount ?: String,
    date ?: String,
    description ?: String,
    currency ?: String
}
const Cards = ({
    heading,
    amount,
    date,
    description,
    currency
}:CardProps) => {
    return (
        <div className="border border-black  rounded flex flex-col items-center justify-center p-2">
            <div className="text-xl">
                <p>{heading}</p>
            </div>
            <div className="text-2xl p-2 font-bold">
                <p>{amount} {currency}</p>
            </div>
            <div className="text-sm p-1">
                <p>Date: {date}</p>
            </div>
            <div className="text-sm p-1">
                <p>
                    {description}
                </p>
            </div>
        </div>
    )
}

export default Cards