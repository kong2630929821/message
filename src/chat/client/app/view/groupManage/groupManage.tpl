<div class="new-page">
    <div ev-back-click="goBack">
        <chat-client-app-widget-topBar-topBar>{title:"群管理"}</chat-client-app-widget-topBar-topBar>
    </div>
    <div w-class="group-manage-wrap" ev-openManageItem="openManageItem">
        <chat-client-app-widget-manageItem-manageItem>{manageList:{{it.manageList}}}</chat-client-app-widget-manageItem-manageItem>
    </div>
    
    <div w-class="destroy" on-tap="destroyGroup">解散群</div>
</div>

