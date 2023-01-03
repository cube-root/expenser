import withSidebar from "../../wrapper/sidebar";
import withUser from "../../wrapper/user";

const AddExpense = ()=>{
    return (
        <div>
            <h1>Add Expense</h1>
        </div>
    )
}

export default withSidebar(withUser(AddExpense));