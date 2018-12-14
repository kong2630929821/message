<div w-class="set-groupChat-wrap" class="new-page">
    <div w-class="top-main-wrap" ev-complete="createGroup" ev-back-click="back">
        <chat-client-app-widget-topBar-topBar>{title:"创建群聊({{it.applyMembers.length}}/500)",searchImg:"search.png",completeImg:"complete.png",background:"#fff"}</chat-client-app-widget-topBar-topBar>
    </div>
    <div w-class="group-info-wrap">
        <div w-class="group-avator-wrap">
            <img w-class="group-avator" src="../../res/images/user.png" />
        </div>
        <div w-class="groupName" ev-input-change="inputName">
            <chat-client-app-widget-input-input>{placeHolder:"群名",style:"width:500px;padding:20px 0;border-bottom:solid #318DE6 1px;"}</chat-client-app-widget-input-input>
        </div>
    </div>
    <div w-class="search-wrap">
        <chat-client-app-widget-input-input>{placeHolder:"成员",style:"width:710px;"}</chat-client-app-widget-input-input>
    </div>
    <div w-class="a-part" ev-changeSelect="changeSelect">
        <div w-class="a">a</div>
        {{for index,item of it1.friends}}
        <div ev-addMember="addMember" style="position:relative;">
            <chat-client-app-widget-selectUser-selectUser>{id:{{item}}, chatType: "user"}</chat-client-app-widget-selectUser-selectUser>
        </div>
        {{end}}
    </div>
</div>