
import { useState } from 'react'
import Setup from './setup';
import Create from './create';

type inputProps = {
    currentSheetLink?: string
    sheetLink?: string
    sheetId?: string
}
const tabs = [
    { id: 'create', name: 'Create new sheet', href: '#' },
    { id: 'setup', name: 'Update current sheet', href: '#' },
    // { id: 'used-sheet', name: 'Used sheets', href: '#' }
]

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}
const RenderComponents = ({ type, props }: { type: string, props: inputProps }) => {
    console.log('inn', type)
    switch (type) {
        case 'create': {
            return <Create />
        }
        case 'setup': {
            return <Setup {...props} />
        }
        case 'used-sheet': {
            return <div>Used sheet</div>
        }
        default: {
            return null
        }
    }
}
export default function SheetSettings({
    currentSheetLink,
    sheetId,
    sheetLink
}: inputProps) {

    const [current, setCurrent] = useState(tabs[0].id)

    return (
        <>
            <div className='font-mono'>
                <main className="flex-1">
                    <div className="relative max-w-4xl mx-auto md:px-8 xl:px-0">
                        <div className="pt-10 pb-16">
                            <div className="px-4 sm:px-6 md:px-0">
                                <h1 className="text-3xl font-extrabold text-gray-900">Sheet Settings</h1>
                                <p className='mt-2'>Share your sheet with:
                                    <div className="mt-2 border p-2 font-bold font-mono">{process.env.CLIENT_EMAIL}</div>
                                </p>
                            </div>
                            <div className="px-4 sm:px-6 md:px-0">
                                <div className="py-6">
                                    {/* Tabs */}
                                    <div className="lg:hidden">
                                        <label htmlFor="selected-tab" className="sr-only">
                                            Select a tab
                                        </label>
                                        <select
                                            onChange={(e) => setCurrent(e.target.value)}
                                            id="selected-tab"
                                            name="selected-tab"
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                                            defaultValue={current}
                                        >
                                            {tabs.map((tab) => (
                                                <option key={tab.name} value={tab.id}>{tab.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="hidden lg:block">
                                        <div className="border-b border-gray-200">
                                            <nav className="-mb-px flex space-x-8">
                                                {tabs.map((tab) => (
                                                    <button
                                                        onClick={() => setCurrent(tab.id)}
                                                        key={tab.name}
                                                        className={classNames(
                                                            current === tab.id
                                                                ? 'border-purple-500 text-purple-600'
                                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                                            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                                                        )}
                                                    >
                                                        {tab.name}
                                                    </button>
                                                ))}
                                            </nav>
                                        </div>
                                    </div>
                                    <div className='mt-3'>
                                        <RenderComponents
                                            type={current}
                                            props={
                                                {
                                                    currentSheetLink,
                                                    sheetId,
                                                    sheetLink
                                                }
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}

