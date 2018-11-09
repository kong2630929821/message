<div w-class="contact-list-wrap" style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
    <div ev-back-click="back">
        <client-app-widget-topBar-topBar w-class="title">{title:"通讯录",background:"#fff",unfoldImg:"add-blue.png"}</client-app-widget-topBar-topBar>
    </div>
    <div w-class="topic-wrap" ev-toNewFriend="toNewFriend">
        <client-app-widget-contactItem-contactItem>{avatorPath:"user.png",text:"新的朋友",isNewAdd:true,totalNew:{{it.applyUserCount}}}</client-app-widget-contactItem-contactItem>
        <client-app-widget-contactItem-contactItem>{avatorPath:"user.png",text:"群聊"}</client-app-widget-contactItem-contactItem>
    </div>
    <div w-class="a-part">
        <div w-class="a">a</div>
        {{for index,item of it.userList}}
        <client-app-widget-contactItem-contactItem>{{item}}</client-app-widget-contactItem-contactItem>
        {{end}}
    </div>
    <div>用户id{{it.sid}}</div>
    <div>已有好友</div>
    {{for key,value of it.friends}}
        <div><span>id:{{value}}</span></div>
    {{end}}  
    <div>别人申请加我为好友</div>
    {{for key,value of it.applyUser}}
        <div><span>id:{{value}}</span></div>
    {{end}}
</div>