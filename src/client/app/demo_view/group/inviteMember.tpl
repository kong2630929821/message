<div class="new-page">
    <div ev-back-click="goBack" ev-complete="completeAddGroupMember">
        <client-app-widget-topBar-topBar>{title:"邀请成员",completeImg:"complete.png",background:"#fff"}</client-app-widget-topBar-topBar>
    </div>
    <div w-class="search-input">
        <client-app-widget-input-input>{placeHolder : "搜索成员",style : "font-size:32px;color:#ccc;padding-left:82px;"}</client-app-widget-input-input>
        <img w-class="searchIcon" src="../../res/images/search-gray.png" />
    </div>
    <div w-class="a-part" ev-changeSelect="changeSelect">
        <div w-class="a">a</div>
        {{for index,item of it1.friends}}
        <div ev-addMember="addGroupMember">
            <client-app-widget-selectUser-selectUser>{id:{{item}}, chatType: "user"}</client-app-widget-selectUser-selectUser>
        </div>
        {{end}}
    </div>
</div>