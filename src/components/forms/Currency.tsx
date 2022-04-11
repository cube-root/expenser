import currency from '../../config/currency.json';

const CurrencyFormField = (props: any) => {
  return (
    <select {...props}>
      {currency.map((type: any, index: any) => {
        return (
          <option key={index} value={type.value}>
            {type.label}
          </option>
        );
      })}
    </select>
  );
};

export default CurrencyFormField;
