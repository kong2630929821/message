<div class="new-page">
    <div ev-back-click="goBack" ev-next-click="completeAddGroupMember">
        <widget w-tag="chat-client-app-widget-topBar-topBar">{title:"分享"}</widget>
    </div>
    <div w-class="search-input">
        <widget w-tag="chat-client-app-widget-input-input">{placeHolder : "搜索成员",style : "font-size:32px;color:#ccc;padding-left:82px;"}</widget>
        <img w-class="searchIcon" src="../../res/images/search-gray.png" />
    </div>
    <div w-class="a-part" ev-changeSelect="changeSelect">
        <div w-class="a">a</div>
        {{for i,v of it1.friends}}
            <div ev-addMember="addGroupMember">
                <widget w-tag="chat-client-app-widget-selectUser-selectUser">{id:{{v}}, chatType: "user"}</widget>
            </div>
        {{end}}
    </div>
</div>