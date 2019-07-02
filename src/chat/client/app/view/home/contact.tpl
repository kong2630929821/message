<div w-class="new-page" class="new-page" on-tap="closeMore">
    <div w-class="topBack" ev-next-click="getMore" ev-contactTop-tab="changeTab" ev-util-click="closeMore">
        {{: show = it1.contactMap.applyUser.length + it1.contactMap.applyGroup.length + it1.inviteUsers.length + it1.convertUser.length}}
        <widget w-tag="chat-client-app-view-home-contactTop">{avatar:{{it.avatar}},showSpot:{{show}},activeTab:{{it.activeTab}},acTag:{{it.acTag}},showUtils:{{it.showUtils}} }</widget>
    </div>
    <app-components1-offlineTip-offlineTip>{ offlienType:{{it.offlienType}} }</app-components1-offlineTip-offlineTip>
    
    {{if it.activeTab == "square"}}
    <div w-class="history-wrap" ev-square-change="changeTag">
        <widget w-tag="chat-client-app-view-home-square">{showTag:{{it.showTag}},active:{{it.acTag}} }</widget>
    </div>

    {{elseif it.activeTab == "message"}}
    <div w-class="history-wrap">
        {{if it1.lastChat && it1.lastChat.length == 0}}
        <div style="text-align: center;">
            <img src="../../res/images/chatEmpty.png" w-class="emptyImg"/>
            <div w-class="emptyText">快开始聊天吧~</div>
        </div>
        {{elseif it1.lastChat}}
        <div w-class="inner-wrap" style="margin-top:{{it.netClose?'10px':'30px;'}}">
            {{for i,v of it1.lastChat}}
            <div ev-chat="chat({{i}})" on-down="onShow" style="margin-bottom: 10px;">
                <widget w-tag="chat-client-app-view-home-messageRecord">{rid:{{v[0]}},time:{{v[1]}},chatType:{{v[2]}} }</widget>
            </div>
            {{end}} 
        </div>
        {{end}}
    </div>
    {{else}}
    
    <widget w-tag="chat-client-app-view-contactList-contactList">{newApply:{{show}} }</widget>
    {{end}}
    
</div>