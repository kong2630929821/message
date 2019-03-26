<div w-class="contactList" >
    
    <div w-class="topic-wrap">
        <div on-tap="goNext(0)" on-down="onShow">
            <chat-client-app-view-contactList-contactItem>{text:"新的朋友", totalNew:{{it1.contact.applyUser.length + it1.contact.applyGroup.length + it1.inviteUsers.length + it1.convertUser.length}}, img:"../../res/images/new-friend.png" }</chat-client-app-view-contactList-contactItem>
        </div>
        <div on-tap="goNext(1)" on-down="onShow">
            <chat-client-app-view-contactList-contactItem>{text:"群聊", img:"../../res/images/groups.png"}</chat-client-app-view-contactList-contactItem>
        </div>
    </div>
    <div w-class="friendPart">
        <div on-tap="goNext(2)"  on-down="onShow">
            <chat-client-app-view-contactList-contactItem>{id: {{it.sid}}, chatType: "user"}</chat-client-app-view-contactList-contactItem>
        </div>
        {{for i,v of it1.contact.friends}}
        <div on-tap="goNext(3,{{v}})" on-down="onShow">
            <chat-client-app-view-contactList-contactItem>{id: {{v}}, chatType: "user"}</chat-client-app-view-contactList-contactItem>
        </div>
        {{end}}
    </div>
</div>