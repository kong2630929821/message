<div class="new-page" w-class="page" ev-back-click="goBack">
    <chat-client-app-widget1-topBar-topBar>{title:"管理关注",background:"#fff"}</chat-client-app-widget1-topBar-topBar>
    <div w-class="input">
        <widget w-tag="chat-client-app-widget1-input-input">{placeHolder:"搜索",style:"border-radius:34px;background:#F9F9F9;font-size:28px;padding-left:65px"}</widget>
        <img w-class="searchIcon" src="../../res/images/search-gray.png" />
    </div>

    {{for i,v of it.followData}}
    <widget w-tag="chat-client-app-view-person-followItem">{data:{{v}}}</widget>
    {{end}}
</div>