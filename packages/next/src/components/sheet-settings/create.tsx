const Create = () => {
    return (
        <div className="mt-10 divide-y divide-gray-200">
            <div className=''>Steps:</div>
            <div className='flex flex-col'>
                <div className='mt-10'>
                    <div className='font-bold text-xl'>1.Copy the email</div>
                    <div className='text-sm text-gray-500'>Please share this email with the sheet</div>
                    <div className="mt-2 border p-2 font-bold font-mono">{process.env.CLIENT_EMAIL}</div>
                </div>
                <div className='mt-5'>
                    <div className='font-bold text-xl'>2.Create new sheet</div>
                    <div className='text-sm text-gray-500'>Click the button to create. NOTE: Login Google drive with same email given here.</div>
                    <dl className="mt-5 ml-4 divide-y divide-gray-200">
                        <a
                            href='https://sheets.new'
                            type="button"
                            target={'_blank'}
                            className="border border-black bg-white p-2 text-purple-600 hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500" rel="noreferrer"
                        >
                            Create New Sheet
                        </a>
                    </dl>
                </div>
            </div>

        </div>
    )
}

export default Create