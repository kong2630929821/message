<div style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
    <client-app-widget-topBar-topBar>{title:"群公告",background:"#fff",shareImg:"share.png"}</client-app-widget-topBar-topBar>
    <div w-class="group-intro-wrap">
        <span w-class="topping">置顶</span>
        <span w-class="text">本群须知</span>
        <span w-class="time">6月8日</span>
    </div>
    {{for index,item of it.announceList}}
    <client-app-widget-announceItem-announceItem>{{item}}</client-app-widget-announceItem-announceItem>
    {{end}}
</div>

