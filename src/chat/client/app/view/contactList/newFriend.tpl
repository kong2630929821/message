<div class="new-page" ev-back-click="goBack">
    <chat-client-app-widget-topBar-topBar>{title:"新的朋友"}</chat-client-app-widget-topBar-topBar>
    <div on-tap="test">新朋友多个</div>
    {{if (it1.contact.applyUser.length + it1.contact.applyGroup.length + it1.inviteUsers.length + it1.convertUser.length) > 0}}
    <div w-class="apply-status-wrap">
        <div w-class="title-wrap">新的朋友</div>
        <div w-class="detail-wrap" ev-agree-friend="agreeClick">
            {{for i,v of it1.contact.applyUser}}
            <widget w-tag="chat-client-app-view-contactList-applyUser">{id: {{v}}, chatType: "user"}</widget>
            {{end}}

            {{%==================我邀请的好友上线================}}
            {{for i,v of it1.inviteUsers}}
            <widget w-tag="chat-client-app-view-contactList-applyUserInvite">{accId: {{v[0]}}, chatType: "user", applyInfo:"你邀请的好友上线了"}</widget>
            {{end}}

            {{%==================邀请我的好友上线================}}
            {{for i,v of it1.convertUser}}
            <widget w-tag="chat-client-app-view-contactList-applyUserInvite">{accId: {{v[0]}}, chatType: "user", applyInfo:"添加邀请你的玩家为好友吧"}</widget>
            {{end}}

            {{for i,v of it1.contact.applyGroup}}
            <div ev-agree-group="agreeGroupApply">
                <widget w-tag="chat-client-app-view-contactList-applyUser">{guid: {{v}}, chatType: "group", isActiveToGroup: false}</widget>
            </div>
            {{end}}
        </div>
    </div>
    {{else}}
    <div w-class="noNewFriend">暂无新朋友申请</div>
    {{end}}
 </div> 