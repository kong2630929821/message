<div class="new-page" ev-next-click="groupChat" ev-back-click="goBack">
    <chat-client-app-widget-topBar-topBar>{title:"群聊",nextImg:"add-blue.png"}</chat-client-app-widget-topBar-topBar>

    <div w-class="search-input" ev-input-change="inputGid">
        <chat-client-app-widget-input-input>{placeHolder : "搜索群聊",style : "font-size:32px;color:#ccc;padding-left:82px;border-radius: 12px;"}</chat-client-app-widget-input-input>
        <img w-class="searchIcon" src="../../res/images/search-gray.png" />
    </div>
    
    <div w-class="a-part" ev-changeSelect="changeSelect">
        <div w-class="a">群聊</div>
        {{for index,item of it1.group}}
        <div on-tap="showInfo({{item}})">
            <chat-client-app-demo_view-contactList-contactItem>{id: {{item}}, chatType: "group"}</chat-client-app-demo_view-contactList-contactItem>
        </div>
        {{end}}
    </div>
    <div on-tap="applyGroup" w-class="applyBtn">添加群聊</div>
</div>