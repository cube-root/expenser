type inputProps = {
    currentSheetLink?: string
    sheetLink?: string
    sheetId?: string
}


const Setup = (props: inputProps) => {
    
    return (
        <>
            <div className="mt-10 divide-y divide-gray-200">
                <div className="mt-6">
                    <dl className="divide-y divide-gray-200">
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                            <dt className="text-sm font-medium text-gray-500">Current Sheet Link</dt>
                            <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <span className="flex-grow">
                                    <a
                                        target={'_blank'}
                                        rel="noreferrer"
                                        href={props.currentSheetLink ? props.currentSheetLink : '#'}
                                    >
                                        {props.sheetId}
                                    </a></span>
                                <span className="ml-4 flex-shrink-0">
                                    <a
                                        target={'_blank'}
                                        rel="noreferrer"
                                        href={props.currentSheetLink ? props.currentSheetLink : '#'}
                                        className="bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                    >
                                        Open Sheet
                                    </a>
                                </span>
                            </dd>
                        </div>

                    </dl>
                </div>
            </div>
        </>)
}

export default Setup