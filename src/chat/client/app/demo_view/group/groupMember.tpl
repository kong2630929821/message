<div class="new-page">
    <div ev-back-click="goBack">
        <chat-client-app-widget-topBar-topBar>{title:"群成员",background:"#fff"}</chat-client-app-widget-topBar-topBar>
    </div>
    <div w-class="search-input" ev-input-change="inputMember">
        <chat-client-app-widget-input-input>{placeHolder : "搜索成员",style : "font-size:32px;color:#ccc;padding-left:82px;"}</chat-client-app-widget-input-input>
        <img w-class="searchIcon" src="../../res/images/search-gray.png" />
    </div>
    <div w-class="member-wrap">
        <div on-tap="inviteMember">
            <chat-client-app-widget-memberItem-memberItem>{avatorPath:"member-op.png",text:"添加成员", isOperation:true}</chat-client-app-widget-memberItem-memberItem>
        </div>
        <div on-tap="deleteMember">
            <chat-client-app-widget-memberItem-memberItem>{avatorPath:"member-op.png",text:"移除成员", isOperation:true}</chat-client-app-widget-memberItem-memberItem>
        </div>
        {{for index,item of it.groupInfo.memberids}}
        <div style="position:relative;">
            <chat-client-app-widget-memberItem-memberItem>{id: {{item}},gid: {{it.gid}}, avatorPath:"user.png", isOperation:false}</chat-client-app-widget-memberItem-memberItem>
            {{if it.isMemberDeleteState && item !== it.groupInfo.ownerid && it.groupInfo.adminids.indexOf(item) === -1}}
            <img on-tap="removeMember({{item}})" src="../../res/images/fail.png" style="position:absolute;top:16px;left:20px;"/>
            {{end}}
        </div>
        {{end}}
    </div>
</div>
