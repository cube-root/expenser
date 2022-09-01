import CreatableSelect from 'react-select/creatable'
import typesOfExpense from '../../config/type-expense.json';


const TypeFormField = (props: any) => {
  const onChange = (data: {
    value: string,
    label: string
    __isNew__?: boolean
  }) => {
    if (props.onChange && data) {
      props.onChange({
        value: data.value.toLowerCase(),
        label: data.label
      })
    }
  }

  return (
    <CreatableSelect
      isClearable
      {...props}
      onChange={onChange}
      options={typesOfExpense}
    />
  );
};

export default TypeFormField;
