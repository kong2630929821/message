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
    <div w-class="history-wrap" >
        {{%<!-- <div w-class="input" on-tap="goSearch">
            <div w-class="searchBox">用户名/ID/手机号</div>
            <img w-class="searchIcon" src="../../res/images/search-gray.png" />
        </div> -->}}
        {{if it1.lastChat && it1.lastChat.length == 0 && it1.notice.length==0}}
        <div style="text-align: center;">
            <img src="../../res/images/chatEmpty.png" w-class="emptyImg"/>
            <div w-class="emptyText">快开始聊天吧~</div>
        </div>
        {{else}}
            {{if it1.notice.length&&it1.notice[0]}}
            <div>
                <div ev-chat="notice" ev-msgCard-utils="changeUtils(e,0)" >
                    <widget w-tag="chat-client-app-view-home-messageCard">{rid:{{it1.notice[0]}},time:{{it1.notice[1]}},chatType:{{it1.notice[2]}},messageTime:{{it1.notice[1]}} }</widget>
                </div>
            </div>
            {{end}}
            {{if it1.lastChat}}
            <div>
                {{for i,v of it1.lastChat}}
                <div ev-chat="chat({{i}})" ev-msgCard-utils="changeUtils(e,{{i}})" >
                    <widget w-tag="chat-client-app-view-home-messageCard">{rid:{{v[0]}},time:{{v[1]}},chatType:{{v[2]}},showUtils:{{it.showMsgUtils == i}},messageTime:{{v[1]}} }</widget>
                </div>
                {{end}} 
            </div>
            {{end}}
        {{end}}
    </div>

    {{elseif it.activeTab == "friend"}}
    {{% ======================好友===============================}}
    <widget w-tag="chat-client-app-view-contactList-contactList" >{newApply:{{show}} }</widget>
    {{end}}
    
</div>