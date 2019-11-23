<div class="new-page" style="display:flex;flex-direction:column;">
    <div ev-back-click="goBack">
        <chat-client-app-widget1-topBar-topBar>{title:"群成员"}</chat-client-app-widget1-topBar-topBar>
    </div>
    <div w-class="content">
        {{for i,v of it.groupInfo.memberids}}
            {{if v !== it.groupInfo.ownerid && it.groupInfo.adminids.indexOf(v) === -1}}
            <div on-tap="goDetail({{v}})">
                <widget w-tag="chat-client-app-widget-userItem-userItem">{data:{{v}},status:1}</widget>
            </div>
            {{end}}
        {{end}}

    </div>
</div>
