<div class="new-page">
    <div ev-back-click="goBack" ev-handleEdit="editGroupAnnounce">
        <client-app-widget-topBar-topBar>{title:"群公告",background:"#fff",editImg:"edit.png"}</client-app-widget-topBar-topBar>
    </div>
    <div w-class="outter">
        <div w-class="inner">
            <div w-class="group-intro-wrap">
                <span w-class="topping">置顶</span>
                <span w-class="text">本群须知</span>
                <span w-class="time">6月8日</span>
            </div>
            {{if it.aIncIdArray.length > 0}}
                {{for index,item of it.aIncIdArray}}
                <client-app-widget-announceItem-announceItem>{aIncId:{{item}} }</client-app-widget-announceItem-announceItem>
                {{end}}
            {{end}}
        </div>
    </div> 
</div>

