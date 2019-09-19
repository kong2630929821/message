<div w-class="new-page" class="new-page" on-tap="closeMore"  ev-square-change="changeTag">
    <div w-class="topBack" ev-next-click="getMore" ev-contactTop-tab="changeTab" ev-util-click="closeMore">
        {{: show = it1.contactMap.applyUser.length + it1.contactMap.applyGroup.length + it1.inviteUsers.length + it1.convertUser.length}}
        <widget w-tag="chat-client-app-view-home-contactTop">{avatar:{{it.userInfo.avatar}},showSpot:{{show}},activeTab:{{it.activeTab}},acTag:{{it.acTag}},showUtils:{{it.isUtilVisible}},showTag:{{it.showTag}} }</widget>
    </div>
    <app-components1-offlineTip-offlineTip>{ offlienType:{{it.offlienType}} }</app-components1-offlineTip-offlineTip>
    
    {{for i, v of it.tabBarList}}
    <div style="visibility: {{v.modulName == it.activeTab ? 'visible' : 'hidden'}}; z-index:{{v.modulName == it.activeTab ? 0 :-1}}; position:absolute;top:132px; width:100%;height:100%;overflow: hidden;">
        <widget w-tag={{v.components}} >{isActive:{{v.modulName == it.activeTab}},showTag:{{it.showTag}},active:{{it.acTag}},newApply:{{show}} }</widget>
    </div>
    {{end}}
</div>