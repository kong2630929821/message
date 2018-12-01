<div class="new-page" ev-back-click="goBack">
    <client-app-widget-topBar-topBar>{title:"新的朋友"}</client-app-widget-topBar-topBar>
    <div w-class="apply-status-wrap">
        <div w-class="title-wrap">新的朋友</div>
        <div w-class="detail-wrap" ev-agree-friend="agreeClick">
            {{for i,v of it.applyUser}}
            <client-app-widget-applyUser-applyUser>{"uid":{{v}} }</client-app-widget-applyUser-applyUser>
            {{end}}
            {{for i,v of it.applyGroup}}
            <div ev-agree-group="agreeGroupApply">
                <client-app-widget-applyUser-applyUser>{"gid":{{v}} }</client-app-widget-applyUser-applyUser>
            </div>
            {{end}}
        </div>
    </div>
 </div> 