<div class="new-page" ev-back-click="back" w-class="page">
    <chat-client-app-widget-topBar-topBar>{title:"搜索",background:"#fff"}</chat-client-app-widget-topBar-topBar>
    <div w-class="input" on-tap="goSearch">
        <div w-class="searchBox">用户名/ID/手机号</div>
        <img w-class="searchIcon" src="../../res/images/search-gray.png" />
    </div>
    <div w-class="btns">
        {{for i,v of it.btns}}
        <div w-class="btn">
            <img src="../../res/images/{{v[0]}}"/>
            <div w-class="text">{{v[1]}}</div>
        </div>
        {{end}}
    </div>
    <div style="text-align:center;background: #F9F9F9;">
        <div w-class="applyBtn" on-tap="applyFriend" on-down="onShow">去找人玩</div>
    </div>

    <div w-class="title">
        <span w-class="mark"></span>
        <span style="flex:1 0 0;">推荐同城玩家</span>
    </div>
    {{for i,v of [1,2,3,4]}}
    <widget w-tag="chat-client-app-view-contactList-applyUserInvite"></widget>
    {{end}}
</div>