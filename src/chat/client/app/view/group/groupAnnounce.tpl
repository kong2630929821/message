<div class="new-page">
    <div ev-back-click="goBack" ev-next-click="editGroupAnnounce">
        <chat-client-app-widget-topBar-topBar>{title:"群公告",nextImg:{{it.isOwner ? "edit.png" : ""}} }</chat-client-app-widget-topBar-topBar>
    </div>
    <div w-class="outter">
        <div w-class="inner">
            {{if it.aIncIdArray.length > 0}}
                {{for index,item of it.aIncIdArray.reverse()}}
                <widget w-tag="chat-client-app-widget-announceItem-announceItem" on-tap="goDetail('{{item}}')">{aIncId:{{item}}}</widget>
                {{end}}
            {{else}}
            <div style="font-size: 32px;text-align: center;color: rgb(34, 34, 34);">当前没有新公告</div>
            {{end}}
        </div>
    </div> 
</div>

