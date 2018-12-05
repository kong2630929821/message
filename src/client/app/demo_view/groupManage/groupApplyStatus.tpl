<div style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
    <div ev-back-click="goBack">    
        <client-app-widget-topBar-topBar>{title:"入群申请",background:"#fff"}</client-app-widget-topBar-topBar>
    </div>
        <div w-class="apply-status-wrap">
            <div w-class="title-wrap">入群申请</div>
            <div w-class="detail-wrap">
                {{for i,v of it1.applyUser}}
                <div ev-agree-joinGroup="agreeJoinGroup">
                    <client-app-widget-applyUser-applyUser>{"uid":{{v}} }</client-app-widget-applyUser-applyUser>
                </div>
                {{end}}
                
            </div>
        </div>
 </div>