import { useRouter } from "next/router";
import SideBar from '../../components/sidebar';
import usePlugin from "../../hooks/plugins";

const PluginList = () => {
    const router = useRouter();
    const { plugin: pluginId } = router.query;
    const { plugins = [] } = usePlugin()
    const currentPlugin = plugins.find(item => item.id === pluginId);
    if (!pluginId || !currentPlugin) {
        return null
    }
    return <>
        <currentPlugin.Component />
    </>
}


const Plugin = () => {
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