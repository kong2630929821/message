<div w-class="set-groupChat-wrap" style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
    <div w-class="top-main-wrap" ev-complete="complete">
        <client-app-widget-topBar-topBar>{title:"创建群聊(0/500)",completeImg:"complete.png",background:"#fff"}</client-app-widget-topBar-topBar>
    </div>
    <div w-class="group-info-wrap">
        <div w-class="group-avator-wrap">
            <img w-class="group-avator" src="../../res/images/user.png" />
        </div>
        <div w-class="groupName">
            <client-app-widget-input-input>{placeHolder:"群名",style:"width:500px;padding:20px 0;border-bottom:solid #318DE6 1px;"}</client-app-widget-input-input>
        </div>
    </div>
    <div w-class="search-wrap">
        <client-app-widget-input-input>{placeHolder:"搜索",style:"width:710px;"}</client-app-widget-input-input>
    </div>
    <div w-class="a-part" ev-changeSelect="changeSelect">
        <div w-class="a">a</div>
        {{for index,item of it.userList}}
        <client-app-widget-selectUser-selectUser>{{item}}</client-app-widget-selectUser-selectUser>
        {{end}}
    </div>
</div>