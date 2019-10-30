{{let normalPersons = it.ginfo.memberids.filter(item => (item !== it.ginfo.ownerid && it.ginfo.adminids.indexOf(item) === -1))}}
<div class="new-page">
    <div ev-back-click="goBack" ev-next-click="completeAddAdmin">
        <chat-client-app-widget1-topBar-topBar>{title:"添加管理员",nextImg:"complete_blue.png"}</chat-client-app-widget1-topBar-topBar>
    </div>
    <div w-class="search-input">
        <chat-client-app-widget1-input-input>{placeHolder : "搜索成员",style : "font-size:32px;color:#ccc;padding-left:82px;"}</chat-client-app-widget1-input-input>
        <img w-class="searchIcon" src="../../res/images/search-gray.png" />
    </div>
    <div w-class="a-part" ev-changeSelect="changeSelect">
        <div w-class="a">a</div>
        {{for index,item of normalPersons}}
        <div ev-addMember="addAdminMember">
            <chat-client-app-widget-selectUser-selectUser>{id:{{item}}, chatType: "group",gid:{{it.gid}} }</chat-client-app-widget-selectUser-selectUser>
        </div>
        {{end}}
    </div>
</div>

