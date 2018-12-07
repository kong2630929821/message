<div w-class="groupList-wrap" style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:#f2f2f2;">
    <div w-class="top-main-wrap" ev-unfold="unfold" ev-back-click="goBack">
        <client-app-widget-topBar-topBar>{title:"群聊",unfoldImg:"add-blue.png",background:"#fff"}</client-app-widget-topBar-topBar>
    </div>
    <div w-class="search-input" ev-input-change="inputGid">
        <client-app-widget-input-input>{placeHolder : "搜索群聊",style : "font-size:32px;color:#ccc;padding-left:82px;"}</client-app-widget-input-input>
        <img w-class="searchIcon" src="../../res/images/search-gray.png" />
    </div>
    <div w-class="a-part" ev-changeSelect="changeSelect">
        <div w-class="a">群聊</div>
        {{for index,item of it.groups}}
        <div on-tap="showInfo({{item}})">
            <client-app-widget-contactItem-contactItem>{id: {{item}}, chatType: "group"}</client-app-widget-contactItem-contactItem>
        </div>
        {{end}}
    </div>
    <div on-tap="applyGroup" w-class="applyBtn">添加群聊</div>
</div>