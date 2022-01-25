type CardProps = {
    heading?: String,
    amount?: String,
    date?: String,
    description?: String,
    currency?: String,
    meta?: any
}
const Cards = ({
    heading,
    amount,
    date,
    description,
    currency,
    meta
}: CardProps) => {
    const onClickCard = () => {
        console.log('clicked', meta)
    }
    return (
        <div
            className="border border-black  rounded flex flex-col items-center justify-center p-2"
        >
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
            <div className="border rounded hover:bg-black hover:text-white p-2">
                <button
                    onClick={onClickCard}
                    className="p-1">
                    Edit
                </button>
            </div>
        </div>
    )
}

export default Cards