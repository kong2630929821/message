<div class="new-page" ev-back-click="goBack">
    <chat-client-app-widget-topBar-topBar>{title:"群公告"}</chat-client-app-widget-topBar-topBar>
    <div w-class="title-wrap">
        {{if !it.aIncId}}
        <span w-class="topping">置顶</span>
        {{end}}
        <span>{{it.title}}</span>
    </div>
    <div w-class="content-wrap">
        {{it.content}}
    </div>
    {{if it.isOwner}}
    <div w-class="delete" on-tap="deleteAnnounce">删除</div>
    {{end}}
</div>

