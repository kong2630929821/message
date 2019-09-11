<div w-class="new-page" class="new-page" on-tap="closeMore"  ev-square-change="changeTag">
    <div w-class="topBack" ev-next-click="getMore" ev-contactTop-tab="changeTab" ev-util-click="closeMore">
        {{: show = it1.contactMap.applyUser.length + it1.contactMap.applyGroup.length + it1.inviteUsers.length + it1.convertUser.length}}
        <widget w-tag="chat-client-app-view-home-contactTop">{avatar:{{it.userInfo.avatar}},showSpot:{{show}},activeTab:{{it.activeTab}},acTag:{{it.acTag}},showUtils:{{it.isUtilVisible}},showTag:{{it.showTag}} }</widget>
    </div>
    <app-components1-offlineTip-offlineTip>{ offlienType:{{it.offlienType}} }</app-components1-offlineTip-offlineTip>
    
    {{if it.activeTab == "square"}}
    {{% ======================广场===============================}}
    <widget w-tag="chat-client-app-view-home-square">{showTag:{{it.showTag}},active:{{it.acTag}} }</widget>

    {{elseif it.activeTab == "message"}}
    {{% ======================消息===============================}}
    <div style="height:100%;overflow: hidden;" ev-chat="evChat">
        <widget w-tag="chat-client-app-view-home-contactNotice"></widget>
    </div>

    {{elseif it.activeTab == "friend"}}
    {{% ======================好友===============================}}
    <widget w-tag="chat-client-app-view-contactList-contactList" >{newApply:{{show}} }</widget>
    {{end}}
    
</div>