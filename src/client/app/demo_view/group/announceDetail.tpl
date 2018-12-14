<div style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
    <client-app-widget-topBar-topBar>{title:"群公告",background:"#fff",shareImg:"share.png"}</client-app-widget-topBar-topBar>
    <div w-class="group-intro-wrap">
        <span w-class="topping">置顶</span>
        <span w-class="text">本群须知</span>
    </div>
    <div w-class="content-wrap">
        {{it.content}}
    </div>
    <span w-class="delete" on-tap="deleteAnnounce">删除</span>
</div>

