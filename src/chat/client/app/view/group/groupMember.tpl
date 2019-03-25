<div class="new-page">
    <div ev-back-click="goBack">
        <chat-client-app-widget-topBar-topBar>{title:"群成员"}</chat-client-app-widget-topBar-topBar>
    </div>
    <div w-class="search-input" ev-input-change="inputMember">
        <chat-client-app-widget-input-input>{placeHolder : "搜索成员",style : "font-size:32px;color:#ccc;padding-left:82px;"}</chat-client-app-widget-input-input>
        <img w-class="searchIcon" src="../../res/images/search-gray.png" />
    </div>
    <div w-class="member-wrap">
        <widget w-tag="chat-client-app-widget-memberItem-memberItem" on-tap="inviteMember">{avatorPath:"../../res/images/add_group_user.png",text:"添加成员", isOperation:true}</widget>

        {{if it.isAdmin}}
        <widget w-tag="chat-client-app-widget-memberItem-memberItem" on-tap="deleteMember">{avatorPath:"../../res/images/del_group_user.png",text:"移除成员", isOperation:true}</widget>
        {{end}}
        
        <widget w-tag="chat-client-app-widget-memberItem-memberItem">{id: {{it.groupInfo.ownerid}},gid: {{it.gid}}, avatorPath:"../../res/images/user_avatar.png", isOwner:true}</widget>
        {{for index,item of it.groupInfo.adminids}}
            {{if item !== it.groupInfo.ownerid}}
                <widget w-tag="chat-client-app-widget-memberItem-memberItem">{id: {{item}},gid: {{it.gid}}, avatorPath:"../../res/images/user_avatar.png", isAdmin:true}</widget>
            {{end}}
        {{end}}

        {{for index,item of it.groupInfo.memberids}}
            {{if item !== it.groupInfo.ownerid && it.groupInfo.adminids.indexOf(item) === -1}}
            <div style="position:relative;">
                <widget w-tag="chat-client-app-widget-memberItem-memberItem">{id: {{item}},gid: {{it.gid}}, avatorPath:"../../res/images/user_avatar.png"}</widget>
                {{if it.deleteBtn}}
                <img on-tap="removeMember({{item}})" src="../../res/images/fail.png" style="position:absolute;top:16px;left:20px;"/>
                {{end}}
            </div>
            {{end}}
        {{end}}
    </div>
</div>
