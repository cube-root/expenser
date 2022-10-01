import { useRouter } from "next/router";
import SideBar from '../../components/sidebar';

const PluginList = () => {
    const router = useRouter();
    console.log(router, 'xx')
    const { plugin } = router.query
    if(!plugin){
        return null
    }
    return <div>Test</div>
}


const Plugin = ()=>{
    return (
        <>
            <SideBar>
                <div className="ml-5 flex flex-col flex-1  h-screen overflow-y-auto no-scrollbar mt-5 text-gray-800 dark:text-white">
                    <div className="flex flex-row gap-3 mt-10">
                        <PluginList />
                    </div>
                </div>
            </SideBar>
        </>
    );
}
export default Plugin;