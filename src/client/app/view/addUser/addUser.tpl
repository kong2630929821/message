<div style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
    <client-app-widget-topBar-topBar w-class="title">{title:"添加好友",background:"#fff"}</client-app-widget-topBar-topBar>
    <div w-class="search-input" ev-input-change="inputUid">
        <client-app-widget-input-input w-class="pi-input idInput">{placeHolder : "搜索地址或手机号",style : "font-size:32px;color:#ccc;padding-left:82px;"}</client-app-widget-input-input>
        <img w-class="searchIcon" src="../../res/images/search-gray.png" />
    </div>
    <div w-class="featureBar-scan-wrap">
        <client-app-widget-featureBar-featureBar>{iconPath:"scan-circle.png",text:"扫一扫"}</client-app-widget-featureBar-featureBar>
    </div>
    <div w-class="featureBar-code-wrap">
        <client-app-widget-featureBar-featureBar>{iconPath:"two-code.png",text:"我的二维码"}</client-app-widget-featureBar-featureBar>
    </div>
    <div>这是添加好友界面</div>
    <div>我的id是{{it.sid}}</div>
    <div>
        <span>请输入对方id</span>
        <div ev-input-change="inputUid">
            <client-app-widget-input-input w-class="pi-input idInput">{placeHolder : "ID",style : "font-size:32px;color:#318DE6"}</client-app-widget-input-input>
        </div>
        <div style="margin-top:60px;" on-tap="openStrangerInfo">点我进入陌生人详细信息界面</div>
    </div>
</div>