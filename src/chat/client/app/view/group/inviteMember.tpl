<div class="new-page"w-class="newPage">
    <div ev-back-click="goBack" ev-next-click="completeBtn">
        <chat-client-app-widget1-topBar-topBar>{title:"邀请成员",nextImg:"complete_blue.png"}</chat-client-app-widget1-topBar-topBar>
    </div>
    <div w-class="search-input">
        <chat-client-app-widget1-input-input>{placeHolder : "搜索成员",style : "font-size:32px;color:#ccc;padding-left:82px;"}</chat-client-app-widget1-input-input>
        <img w-class="searchIcon" src="../../res/images/search-gray.png" />
    </div>
    <div w-class="userList">
        <div w-class="a">
            {{for i,v of it.followAndFans}}
            <div ev-checked="checked(e,{{i}})">
                <widget w-tag="chat-client-app-view-person-followItem">{data:{{v}}, status:4 }</widget>
            </div>
            {{end}}
        </div>
    
    </div>
</div>