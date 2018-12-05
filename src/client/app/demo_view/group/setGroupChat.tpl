<div w-class="set-groupChat-wrap" style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
    <div w-class="top-main-wrap" ev-complete="createGroup" ev-back-click="back">
        <client-app-widget-topBar-topBar>{title:"创建群聊(0/500)",searchImg:"search.png",completeImg:"complete.png",background:"#fff"}</client-app-widget-topBar-topBar>
    </div>
    <div w-class="group-info-wrap">
        <div w-class="group-avator-wrap">
            <img w-class="group-avator" src="../../res/images/user.png" />
        </div>
        <div w-class="groupName" ev-input-change="inputName">
            <client-app-widget-input-input>{placeHolder:"群名",style:"width:500px;padding:20px 0;border-bottom:solid #318DE6 1px;"}</client-app-widget-input-input>
        </div>
    </div>
    <div w-class="search-wrap">
        <client-app-widget-input-input>{placeHolder:"成员",style:"width:710px;"}</client-app-widget-input-input>
    </div>
    <div w-class="a-part" ev-changeSelect="changeSelect">
        <div w-class="a">a</div>
        {{for index,item of it1.friends}}
        <div on-tap="addMember({{item}})">
            <client-app-widget-selectUser-selectUser>{"uid":{{item}},isSelect : {{it.isSlect}}}</client-app-widget-selectUser-selectUser>
        </div>
        {{end}}
    </div>
</div>