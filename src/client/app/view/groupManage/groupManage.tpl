<div style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
    <client-app-widget-topBar-topBar>{title:"群管理",background:"#fff"}</client-app-widget-topBar-topBar>
    <div w-class="group-manage-wrap">
        <client-app-widget-manageItem-manageItem>{manageList:{{it.manageList}}}</client-app-widget-manageItem-manageItem>
    </div>
    <div w-class="other-wrap">
        <client-app-widget-groupSetItem-groupSetItem>{groupSetList:{{it.groupSetList}}}</client-app-widget-groupSetItem-groupSetItem>
    </div>
    <div w-class="destroy" on-tap="destroyGroup">解散群</div>
</div>

