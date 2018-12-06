{{: it1 = it1 || {"applyUser":[],"applyGroup":[]} }}
<div class="new-page" ev-back-click="goBack">
    <client-app-widget-topBar-topBar>{title:"新的朋友"}</client-app-widget-topBar-topBar>
    {{if it1.applyUser.length>0 || it1.applyGroup.length>0}}
    <div w-class="apply-status-wrap">
        <div w-class="title-wrap">新的朋友</div>
        <div w-class="detail-wrap" ev-agree-friend="agreeClick">
            {{for i,v of it1.applyUser}}
            <client-app-demo_view-contactList-applyUser>{"uid":{{v}} }</client-app-demo_view-contactList-applyUser>
            {{end}}
            {{for i,v of it1.applyGroup}}
            <div ev-agree-group="agreeGroupApply">
                <client-app-widget-applyUser-applyUser>{"gid":{{v}} }</client-app-widget-applyUser-applyUser>
            </div>
            {{end}}
        </div>
    </div>
    {{else}}
    <div w-class="noNewFriend">暂无新朋友申请</div>
    {{end}}
 </div> 