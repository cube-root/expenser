import { useEffect } from "react";
import SideBar from "../../components/sidebar";
import hooks from "../../hooks";

// const Home = () => {
//     return (
//         <div>
//             <SideBar />
//             <div className="md:pl-72 flex flex-col flex-1  h-screen overflow-y-auto">
//                 <div className="py-6">
//                     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                         <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
//                     </div>
//                     <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                        
//                         <div className="py-4">
//                             <div className="border-4 border-dashed border-gray-200 rounded-lg h-96" />
//                         </div>
                        
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }
const Home = ()=>{
    const storage = hooks.GetStorageData()
    return (
        <SideBar />
    )
}
export default Home;