<div class="new-page" ev-back-click="goBack">
    <chat-client-app-widget-topBar-topBar>{title:"群公告"}</chat-client-app-widget-topBar-topBar>
    <div w-class="title-wrap">
        <span>{{it.title}}</span>
    </div>
    <div w-class="content-wrap">
        {{it.content}}
    </div>
    <div w-class="delete" on-tap="deleteAnnounce">删除</div>
</div>

