import { useState, useRef } from 'react';
import Forms from '../../components/forms';

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
    const [isEditing, setEditing] = useState(false);

    const headingRef = useRef<any>(heading)
    const amountRef = useRef<any>(amount)
    const dateRef = useRef<any>(date)
    const descriptionRef = useRef<any>(description)
    const currencyRef = useRef<any>(currency)


    const onClickEdit = () => {
        console.log('clicked', meta)
        setEditing(true);
    }
    const onCancel = () => {
        headingRef.current = heading
        amountRef.current = amount
        dateRef.current = date
        descriptionRef.current = description
        currencyRef.current = currency

        setEditing(false);
    }
    return (
        <div
            className="border border-white  rounded flex flex-col items-center justify-center p-2"
        >
            <div className="text-xl">
                {!isEditing && (<p>{headingRef.current}</p>)}
                {isEditing && (
                    <Forms.TypeFormField
                        defaultValue={headingRef.current}
                        onChange={(event: any) => { headingRef.current = event.target.value }}
                    />
                )}
            </div>
            <div className="text-2xl text-white p-2 font-mono">
                {!isEditing && (
                    <p>{amountRef.current} {currencyRef.current}</p>
                )}
                {isEditing && (
                    <div className='flex flex-row'>
                        <Forms.AmountFormField
                            className='w-full text-white font-mono'
                            type='number'
                            defaultValue={amountRef.current}
                            onChange={(event: any) => { amountRef.current = event.target.value }}
                        />
                        <Forms.CurrencyFormField
                            className='w-full text-white font-mono'
                            onChange={(event: any) => {
                                currencyRef.current = event.target.value
                            }}
                        />
                    </div>
                )}
            </div>
            <div className="text-sm text-white font-mono p-1">
                <p>Date: {dateRef.current}</p>
            </div>
            <div className="text-sm p-1">
                {isEditing && (
                    <Forms.RemarkFormField
                        placeholder='Remark'
                        className="text-white font-mono"
                        defaultValue={descriptionRef.current}
                        onChange={(event: any) => {
                            descriptionRef.current = event.target.value
                        }}
                    />
                )}
                {!isEditing && (
                    <p className='text-white font-mono'>
                        {descriptionRef.current}
                    </p>
                )}
            </div>
            <div className=" flex flex-row p-2">
                {/* <button
                    className="border rounded font-mono bg-white hover:bg-black hover:text-white p-2"
                    onClick={onClickEdit}
                >
                    {!isEditing ? 'Edit' : 'Save'}
                </button> */}
                {isEditing && (
                    <button
                        onClick={onCancel}
                        className="border rounded font-mono  hover:bg-black hover:text-white p-2"
                    >
                        
                    </button>
                )}
            </div>
        </div>
    )
}

export default Cards