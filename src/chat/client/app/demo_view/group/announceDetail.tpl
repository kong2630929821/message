<div class="new-page" ev-back-click="goBack">
    <chat-client-app-widget-topBar-topBar>{title:"群公告",background:"#fff"}</chat-client-app-widget-topBar-topBar>
    <div w-class="group-intro-wrap">
        <span w-class="topping">置顶</span>
        <span w-class="text">本群须知</span>
    </div>
    <div w-class="content-wrap">
        {{it.content}}
    </div>
    <span w-class="delete" on-tap="deleteAnnounce">删除</span>
</div>

