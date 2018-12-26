{{: it1 = it1 || {"friends":[], "applyUser":[], "applyGroup":[]} }}
<div w-class="new-page" class="new-page" ev-back-click="goBack">
    <chat-client-app-widget-topBar-topBar>{title:"通讯录"}</chat-client-app-widget-topBar-topBar>
    
    <div w-class="content">
        <div w-class="topic-wrap">
            <div on-tap="goNext(0)" style="border-bottom: 1px solid #DBDBE5;" >
                <chat-client-app-demo_view-contactList-contactItem>{text:"新的朋友",totalNew:{{it1.applyUser.length + it1.applyGroup.length}} }</chat-client-app-demo_view-contactList-contactItem>
            </div>
            <div on-tap="goNext(1)" >
                <chat-client-app-demo_view-contactList-contactItem>{text:"群聊"}</chat-client-app-demo_view-contactList-contactItem>
            </div>
        </div>
        <div w-class="friendPart">
            {{for i,v of it1.friends}}
            <div on-tap="goNext(2,{{v}})" style="border-bottom: 1px solid #DBDBE5;" >
                <chat-client-app-demo_view-contactList-contactItem>{id: {{v}}, chatType: "user"}</chat-client-app-demo_view-contactList-contactItem>
            </div>
            {{end}}
        </div>
    </div>
</div>