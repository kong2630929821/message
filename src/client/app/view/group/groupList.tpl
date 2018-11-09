<div w-class="groupList-wrap" style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
    <div w-class="top-main-wrap" ev-unfold="unfold">
        <client-app-widget-topBar-topBar>{title:"群聊",unfoldImg:"add-blue.png",background:"#fff"}</client-app-widget-topBar-topBar>
    </div>
    <div w-class="search-input" ev-input-change="inputUid">
        <client-app-widget-input-input>{placeHolder : "搜索群聊",style : "font-size:32px;color:#ccc;padding-left:82px;"}</client-app-widget-input-input>
        <img w-class="searchIcon" src="../../res/images/search-gray.png" />
    </div>
    <div w-class="a-part" ev-changeSelect="changeSelect">
        <div w-class="a">群聊</div>
        {{for index,item of it.groupList}}
        <client-app-widget-contactItem-contactItem>{{item}}</client-app-widget-contactItem-contactItem>
        {{end}}
    </div>
</div>