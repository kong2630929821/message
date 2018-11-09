<div style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
        <client-app-widget-topBar-topBar>{title:"新的朋友",background:"#fff"}</client-app-widget-topBar-topBar>
        <div w-class="apply-status-wrap">
            <div w-class="title-wrap">新的朋友</div>
            <div w-class="detail-wrap">
                {{for index,item of it.applyUserList}}
                <client-app-widget-applyUser-applyUser>{{item}}</client-app-widget-applyUser-applyUser>
                {{end}}
            </div>
        </div>
        <div>这是新朋友验证消息状态界面 id{{it.sid}}</div> 
 </div>