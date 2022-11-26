

import withUser from '../../wrapper/check-user';
import SheetSettingTabs from '../../components/sheet-settings';
import SideBar from '../../components/sidebar';

const SheetSettings = () => {

    return (<>
        <SideBar>
            <SheetSettingTabs />
        </SideBar>
    </>)
}

export default withUser(SheetSettings);