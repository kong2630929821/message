<div class="new-page">
    <div ev-back-click="goBack" ev-next-click="completeAddGroupMember">
        <chat-client-app-widget-topBar-topBar>{title:"邀请成员",nextImg:"complete_blue.png"}</chat-client-app-widget-topBar-topBar>
    </div>
    <div w-class="search-input">
        <chat-client-app-widget-input-input>{placeHolder : "搜索成员",style : "font-size:32px;color:#ccc;padding-left:82px;"}</chat-client-app-widget-input-input>
        <img w-class="searchIcon" src="../../res/images/search-gray.png" />
    </div>
    <div w-class="a-part" ev-changeSelect="changeSelect">
        <div w-class="a">a</div>
        {{for index,item of it1.friends}}
        <div ev-addMember="addGroupMember">
            <chat-client-app-widget-selectUser-selectUser>{id:{{item}}, chatType: "user"}</chat-client-app-widget-selectUser-selectUser>
        </div>
        {{end}}
    </div>
</div>