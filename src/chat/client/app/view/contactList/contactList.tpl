{{: it1 = it1 || {"friends":[], "applyUser":[], "applyGroup":[]} }}
<div w-class="new-page" class="new-page" ev-back-click="goBack">
    <chat-client-app-widget-topBar-topBar>{title:"通讯录"}</chat-client-app-widget-topBar-topBar>
    
    <div w-class="content">
        <div w-class="topic-wrap">
            <div on-tap="goNext(0)" >
                <chat-client-app-view-contactList-contactItem>{text:"新的朋友", totalNew:{{it1.applyUser.length + it1.applyGroup.length}}, img:"../../res/images/new-friend.png" }</chat-client-app-view-contactList-contactItem>
            </div>
            <div on-tap="goNext(1)" >
                <chat-client-app-view-contactList-contactItem>{text:"群聊", img:"../../res/images/groups.png"}</chat-client-app-view-contactList-contactItem>
            </div>
        </div>
        <div w-class="friendPart">
            <div on-tap="goNext(2)"  >
                <chat-client-app-view-contactList-contactItem>{id: {{it.sid}}, chatType: "user"}</chat-client-app-view-contactList-contactItem>
            </div>
            {{for i,v of it1.friends}}
            <div on-tap="goNext(3,{{v}})" >
                <chat-client-app-view-contactList-contactItem>{id: {{v}}, chatType: "user"}</chat-client-app-view-contactList-contactItem>
            </div>
            {{end}}
        </div>
    </div>
</div>