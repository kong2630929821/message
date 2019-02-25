<div class="new-page" ev-back-click="back" style="overflow-x:hidden;overflow-y:auto;">
    <chat-client-app-widget-topBar-topBar w-class="title">{title:"添加好友"}</chat-client-app-widget-topBar-topBar>
    <div w-class="search-input" ev-input-change="inputUid">
        <chat-client-app-widget-input-input w-class="pi-input idInput">{placeHolder:"搜索用户ID",style:"font-size:32px;padding-left:82px;border-radius: 12px;",input:{{it.rid}} }</chat-client-app-widget-input-input>
        <img w-class="searchIcon" src="../../res/images/search-gray.png" />
    </div>
    <div w-class="applyBtn" on-tap="goNext(e,2)" on-down="onShow">添加好友</div>

    <div w-class="featureBar-scan-wrap" on-tap="goNext(e,0)" on-down="onShow">
        <chat-client-app-widget-featureBar-featureBar>{iconPath:"scan-circle.png",text:"扫一扫"}</chat-client-app-widget-featureBar-featureBar>
    </div>
    <div w-class="featureBar-code-wrap" on-tap="goNext(e,1)" on-down="onShow">
        <chat-client-app-widget-featureBar-featureBar>{iconPath:"two-code.png",text:"我的二维码"}</chat-client-app-widget-featureBar-featureBar>
    </div>
</div>