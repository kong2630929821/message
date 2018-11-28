{{: it1 = it1 || {"friends":[], "applyUser":[]} }}
<div w-class="contact-list-wrap" class="new-page">
    <div ev-back-click="goBack">
        <client-app-widget-topBar-topBar w-class="title">{title:"通讯录",background:"#fff",unfoldImg:"add-blue.png"}</client-app-widget-topBar-topBar>
    </div>
    <div w-class="topic-wrap">
        <div on-tap="toNewFriend" style="border-bottom: 1px solid #DBDBE5;">
            <client-app-widget-contactItem-contactItem>{text:"新的朋友",totalNew:{{it1.applyUser.length}} }</client-app-widget-contactItem-contactItem>
        </div>
        <client-app-widget-contactItem-contactItem>{text:"群聊"}</client-app-widget-contactItem-contactItem>
    </div>
    <div w-class="a-part">
        {{for i,v of it1.friends}}
        <div on-tap="friendInfo({{v}})" style="border-bottom: 1px solid #DBDBE5;">
            <client-app-widget-contactItem-contactItem>{"uid":{{v}} }</client-app-widget-contactItem-contactItem>
        </div>
        {{end}}
    </div>
</div>