{{: it1 = it1 || {"friends":[], "applyUser":[], "applyGroup":[]} }}
<div w-class="contact-list-wrap" class="new-page">
    <div ev-back-click="goBack">
        <chat-client-app-widget-topBar-topBar w-class="title">{title:"通讯录",background:"#fff",unfoldImg:"add-blue.png"}</chat-client-app-widget-topBar-topBar>
    </div>
    <div w-class="topic-wrap">
        <div on-tap="toNewFriend" style="border-bottom: 1px solid #DBDBE5;">
            <chat-client-app-demo_view-contactList-contactItem>{text:"新的朋友",totalNew:{{it1.applyUser.length + it1.applyGroup.length}} }</chat-client-app-demo_view-contactList-contactItem>
        </div>
        <div on-tap="toGroup" style="border-bottom: 1px solid #DBDBE5;">
            <chat-client-app-demo_view-contactList-contactItem>{text:"群聊"}</chat-client-app-demo_view-contactList-contactItem>
        </div>
    </div>
    <div w-class="a-part">
        {{for i,v of it1.friends}}
        <div on-tap="friendInfo({{v}})" style="border-bottom: 1px solid #DBDBE5;">
            <chat-client-app-demo_view-contactList-contactItem>{id: {{v}}, chatType: "user"}</chat-client-app-demo_view-contactList-contactItem>
        </div>
        {{end}}
    </div>
</div>