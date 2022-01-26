import typesOfExpense from '../../config/type-expense.json';


const TypeFormField = (props: any) => {
    return (
        <select {...props}>
            {typesOfExpense.map((type: any, index: any) => {
                return (
                    <option
                        key={index}
                        value={type.value}
                        selected={type.defaultValue ? true : false}
                    >
                        {type.label}
                    </option>
                )
            })}
        </select>
    )
}

export default TypeFormField