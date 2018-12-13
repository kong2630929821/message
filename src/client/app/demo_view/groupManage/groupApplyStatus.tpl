<div class="new-page">
    <div ev-back-click="goBack">    
        <client-app-widget-topBar-topBar>{title:"入群申请",background:"#fff"}</client-app-widget-topBar-topBar>
    </div>
        {{if it.groupInfo.applyUser.length>0}}
        <div w-class="apply-status-wrap">
            <div w-class="title-wrap">入群申请</div>
            <div w-class="detail-wrap">
                {{for i,v of it.groupInfo.applyUser}}
                <div ev-agree-joinGroup="agreeJoinGroup">
                    <client-app-demo_view-contactList-applyUser>{id: {{v}}, chatType: "group", isActiveToGroup: true, activeToGGid:{{it.gid}}}</client-app-demo_view-contactList-applyUser>
                </div>
                {{end}}
                
            </div>
        </div>
        {{else}}
        <div w-class="noUserApply">暂无用户申请进群</div>
        {{end}}
 </div>