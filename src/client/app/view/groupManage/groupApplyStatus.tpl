<div style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
        <client-app-widget-topBar-topBar>{title:"入群申请",background:"#fff"}</client-app-widget-topBar-topBar>
        <div w-class="apply-status-wrap">
            <div w-class="title-wrap">入群申请</div>
            <div w-class="detail-wrap">
                <client-app-widget-applyUser-applyUser>{applyUserList:{{it.applyUserList}}}</client-app-widget-applyUser-applyUser>
            </div>
        </div>
        <div>这是入群申请状态界面 id{{it.rid}}</div> 
 </div>