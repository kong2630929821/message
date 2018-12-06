{{: it1 = it1 || {"friends":[], "applyUser":[], "applyGroup":[]} }}
<div w-class="contact-list-wrap" class="new-page">
    <div ev-back-click="goBack">
        <client-app-widget-topBar-topBar w-class="title">{title:"通讯录",background:"#fff",unfoldImg:"add-blue.png"}</client-app-widget-topBar-topBar>
    </div>
    <div w-class="topic-wrap">
        <div on-tap="toNewFriend" style="border-bottom: 1px solid #DBDBE5;">
            <client-app-widget-contactItem-contactItem>{text:"新的朋友",totalNew:{{it1.applyUser.length + it1.applyGroup.length}} }</client-app-widget-contactItem-contactItem>
        </div>
        <div on-tap="toGroup" style="border-bottom: 1px solid #DBDBE5;">
            <client-app-demo_view-contactList-contactItem>{text:"群聊"}</client-app-demo_view-contactList-contactItem>
        </div>
    </div>
    <div w-class="a-part">
        {{for i,v of it1.friends}}
        <div on-tap="friendInfo({{v}})" style="border-bottom: 1px solid #DBDBE5;">
            <client-app-demo_view-contactList-contactItem>{"uid":{{v}} }</client-app-demo_view-contactList-contactItem>
        </div>
        {{end}}
    </div>
</div>