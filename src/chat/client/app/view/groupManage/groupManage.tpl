<div class="new-page">
    <div ev-back-click="goBack">
        <chat-client-app-widget1-topBar-topBar3>{leftImg:"left_arrow_blue.png",title:"群管理",rightText:"" }</chat-client-app-widget1-topBar-topBar3>
    </div>
    <div w-class="group-manage-wrap" ev-openManageItem="openManageItem">
        <chat-client-app-widget-manageItem-manageItem>{manageList:{{it.manageList.slice(0,it.manageList.length-1)}}}</chat-client-app-widget-manageItem-manageItem>
    </div>

    <div w-class="other-wrap">
        {{for i,v of it.groupSets}}
        <div w-class="groupSet-item-wrap" on-tap="">
            <div w-class="itemText-wrap">
                <span w-class="title">{{v.title}}</span>
            </div>
            
            {{if v.showSwitch}}
            <div w-class="switch" ev-switch-click="joinNeedAgree">
                <chat-client-app-widget-switch-switch>{types:{{it.groupInfo.need_agree}},activeColor:"linear-gradient(to right,#318DE6,#38CFE7)",inactiveColor:"#dddddd"}</chat-client-app-widget-switch-switch>
            </div>
            {{end}}
        </div>
        {{end}}
    </div>

    <div w-class="group-manage-wrap" ev-openManageItem="destroyGroup">
        <chat-client-app-widget-manageItem-manageItem>{manageList:{{it.manageList.slice(it.manageList.length-1)}} }</chat-client-app-widget-manageItem-manageItem>
    </div>
</div>

