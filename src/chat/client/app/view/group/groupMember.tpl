<div class="new-page" style="display:flex;flex-direction:column;">
    <div ev-back-click="goBack">
        <chat-client-app-widget1-topBar-topBar>{title:"群成员"}</chat-client-app-widget1-topBar-topBar>
    </div>
    <div w-class="content">
        {{for i,v of it.groupUserData}}
            <div ev-goDetail-user="goDetail" ev-remove-user="removeMember">
                <widget w-tag="chat-client-app-view-person-followItem">{data:{{v}}, status:2 }</widget>
            </div>
        {{end}}

    </div>
</div>
