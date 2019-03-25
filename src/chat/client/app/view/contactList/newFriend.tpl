{{: it1 = it1 || {contact:{"applyUser":[],"applyGroup":[]},inviteUsers:[]} }}
<div class="new-page" ev-back-click="goBack">
    <chat-client-app-widget-topBar-topBar>{title:"新的朋友"}</chat-client-app-widget-topBar-topBar>
    {{if it1.contact.applyUser.length>0 || it1.contact.applyGroup.length>0}}
    <div w-class="apply-status-wrap">
        <div w-class="title-wrap">新的朋友</div>
        <div w-class="detail-wrap" ev-agree-friend="agreeClick">
            {{for i,v of it1.contact.applyUser}}
            <chat-client-app-view-contactList-applyUser>{id: {{v}}, chatType: "user"}</chat-client-app-view-contactList-applyUser>
            {{end}}

            {{%==================我邀请的好友上线================}}
            {{for i,v of it1.inviteUsers}}
            <chat-client-app-view-contactList-applyUser>{id: {{v.uid}}, chatType: "user"}</chat-client-app-view-contactList-applyUser>
            {{end}}

            {{%==================邀请我的好友上线================}}
            {{if it.convertUser}}
            <chat-client-app-view-contactList-applyUser>{id: {{it.convertUser.uid}}, chatType: "user"}</chat-client-app-view-contactList-applyUser>
            {{end}}

            {{for i,v of it1.contact.applyGroup}}
            <div ev-agree-group="agreeGroupApply">
                <chat-client-app-view-contactList-applyUser>{guid: {{v}}, chatType: "group", isActiveToGroup: false}</chat-client-app-view-contactList-applyUser>
            </div>
            {{end}}
        </div>
    </div>
    {{else}}
    <div w-class="noNewFriend">暂无新朋友申请</div>
    {{end}}
 </div> 