type CardProps = {
    heading?: String,
    description?: String,
    spanText?: String,
    children?: React.Component | undefined
}
type TimeLineProps = {
    values?: Array<CardProps>
}
const Cards = ({
    heading = "Heading",
    description = "Description",
    spanText = "Span Text",
    children = undefined,
}: CardProps) => {
    const colours = ['blue', 'green', 'pink', 'purple', 'yellow'];
    const randomColor = colours[Math.floor(Math.random() * (colours.length - 1)) + 1]
    return (
        <div className={`transform transition cursor-pointer hover:-translate-y-2 ml-10 relative flex items-center px-6 py-4 bg-${randomColor}-600 text-white rounded mb-10 flex-col md:flex-row space-y-4 md:space-y-0`}>
            <div className={`w-5 h-5 bg-${randomColor}-600 absolute -left-10 transform -translate-x-2/4 rounded-full z-10 mt-2 md:mt-0`}></div>
            <div className={`w-10 h-1 bg-${randomColor}-300 absolute -left-10 z-0`}></div>
            <div className="flex-auto">
                <h1 className="text-lg">{heading}</h1>
                <h1 className="text-xl font-bold">{description}</h1>
                <h3>{spanText}</h3>
                {children && children}
            </div>
            {/* <a href="#" className="text-center text-white hover:text-gray-300">Download materials</a> */}
        </div>
    )
}

const TimeLine = ({ values = [] }: TimeLineProps) => {
    console.log(values);
    return (
        <div className="w-10/12 md:w-7/12 lg:6/12 mx-auto relative py-20">
            <h1 className="text-3xl text-center font-bold text-blue-500">Expense History</h1>
            <div className="border-l-2 mt-10">
                {values.map((item, index) => {
                    return (
                        <Cards
                            key={index}
                            heading={item.heading}
                            description={item.description}
                            spanText={item.spanText}
                        >
                            {item.children}
                        </Cards>)
                })}
            </div>
        </div>
    )
}


export default TimeLine;