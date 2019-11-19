<div class="new-page" ev-back-click="goBack" style="background-color: #fff">
    <chat-client-app-widget1-topBar-topBar3>{leftImg:"left_arrow_blue.png",title:"群公告",rightText:"" }</chat-client-app-widget1-topBar-topBar3>
    <div w-class="content-wrap">
        {{it.content}}
    </div>
    {{if it.isOwner}}
    <div w-class="delete" on-tap="deleteAnnounce">删除</div>
    {{end}}
</div>

