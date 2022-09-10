import currency from '../../config/currency.json';
import { useState, useEffect } from 'react'
const CurrencyFormField = (props: any) => {
  const [options, setOptions] = useState(currency);
  useEffect(() => {
    if (props.default !== undefined) {
      const temp = [...options, {
        value: props.default,
        label: props.default,
        selected: true
      }]
      setOptions(temp.filter((obj, pos, arr) => {
        return arr
          .map(mapObj => mapObj.value)
          .indexOf(obj.value) == pos;
      }))
    }
  }, [props.default])
  return (
    <select {...props}>
      {options.map((type: any, index: any) => {
        return (
          <option
            key={index}
            value={type.value}
            selected={type.selected || false}
          >
            {type.label}
          </option>
        );
      })}
    </select>
  );
};

export default CurrencyFormField;
