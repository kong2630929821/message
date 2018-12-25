<div class="new-page" ev-back-click="back">
    <chat-client-app-widget-topBar-topBar w-class="title">{title:"添加好友"}</chat-client-app-widget-topBar-topBar>
    <div w-class="search-input" ev-input-change="inputUid">
        <chat-client-app-widget-input-input w-class="pi-input idInput">{placeHolder : "搜索地址或手机号",style : "font-size:32px;color:#ccc;padding-left:82px;border-radius: 12px;"}</chat-client-app-widget-input-input>
        <img w-class="searchIcon" src="../../res/images/search-gray.png" />
    </div>
    <div w-class="featureBar-scan-wrap" on-tap="scanQrcode">
        <chat-client-app-widget-featureBar-featureBar>{iconPath:"scan-circle.png",text:"扫一扫"}</chat-client-app-widget-featureBar-featureBar>
    </div>
    <div w-class="featureBar-code-wrap" on-tap="showQrcode" class="ripple">
        <chat-client-app-widget-featureBar-featureBar>{iconPath:"two-code.png",text:"我的二维码"}</chat-client-app-widget-featureBar-featureBar>
    </div>
    <div on-tap="applyFriend" w-class="applyBtn">添加好友</div>
</div>