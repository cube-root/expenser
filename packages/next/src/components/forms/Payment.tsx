import Select from 'react-select';
import modes from '../../config/payment-mode.json';
const ModeOfPayment = (props: any) => {
    return <Select
        options={modes}
        {...props}
    />
}

export default ModeOfPayment;