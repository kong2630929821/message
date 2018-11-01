<div w-class="contact-list-wrap" style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
    <client-app-widget-topBar-topBar w-class="title">{title:"通讯录",background:"#fff",unfoldImg:"../../res/images/add-blue.png"}</client-app-widget-topBar-topBar>
    <div w-class="topic-wrap">
        <client-app-widget-contactItem-contactItem>{avatorPath:"user.png",text:"新的朋友",isNewAdd:true,totalNew:17}</client-app-widget-contactItem-contactItem>
        <client-app-widget-contactItem-contactItem>{avatorPath:"user.png",text:"群聊"}</client-app-widget-contactItem-contactItem>
    </div>
    <div w-class="a-part">
        <div w-class="a">a</div>
        {{for index,item of it.userList}}
        <client-app-widget-contactItem-contactItem>{{item}}</client-app-widget-contactItem-contactItem>
        {{end}}
    </div>
</div>