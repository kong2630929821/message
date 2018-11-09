<div style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
        <client-app-widget-topBar-topBar>{title:"入群申请",background:"#fff"}</client-app-widget-topBar-topBar>
        <div w-class="newfriend-wrap">
            <client-app-widget-featureBar-featureBar>{iconPath:"user.png",text:"用户昵称"}</client-app-widget-featureBar-featureBar>
        </div>
        <div w-class="attach-info-wrap">
            <div w-class="title-wrap">附加信息</div>
            <div w-class="detail-wrap">{{it.applyInfo}}</div>
        </div>
        <div w-class="agree-wrap">
            <span w-class="reject" on-tap="reject">拒绝</span>
            <span w-class="agree" on-tap="agree">同意</span>
        </div>
        <div>这是入群验证消息界面</div>
        <div>验证消息{{it.applyInfo}}</div>   
</div>