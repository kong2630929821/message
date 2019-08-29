<div class="new-page" ev-back-click="back" w-class="page">
    <chat-client-app-widget-topBar-topBar>{title:"搜索",background:"#fff"}</chat-client-app-widget-topBar-topBar>
    <div w-class="search-input" ev-input-change="inputUid" on-tap="goSearch">
        <chat-client-app-widget-input-input w-class="pi-input idInput">{placeHolder:"搜索用户ID",style:"font-size:32px;padding-left:82px;border-radius: 12px;",input:{{it.rid}} }</chat-client-app-widget-input-input>
        <img w-class="searchIcon" src="../../res/images/search-gray.png" />
    </div>
    <div w-class="applyBtn" on-tap="goNext(e,2)" on-down="onShow">添加好友</div>

    <div w-class="featureBar-scan-wrap" on-tap="goNext(e,0)" on-down="onShow">
        <div w-class="featurebar">
            <img w-class="icon" src="../../res/images/scan-circle.png" />
            <span w-class="text">扫一扫</span>
            <img w-class="more" src="../../res/images/more-gray.png" on-tap="more"/>
        </div>
    </div>
    <div w-class="featureBar-code-wrap" on-tap="goNext(e,1)" on-down="onShow">
        <div w-class="featurebar">
            <img w-class="icon" src="../../res/images/two-code.png" />
            <span w-class="text">我的二维码</span>
            <img w-class="more" src="../../res/images/more-gray.png" on-tap="more"/>
        </div>
    </div>
   
</div>