<div class="new-page">
        <div ev-back-click="goBack">     
            <chat-client-app-widget-topBar-topBar>{title:"入群申请"}</chat-client-app-widget-topBar-topBar>
        </div>
        <div w-class="newfriend-wrap">
            <chat-client-app-widget-featureBar-featureBar>{iconPath:"user.png",text:{{it.name}}}</chat-client-app-widget-featureBar-featureBar>
        </div>
        <div w-class="attach-info-wrap">
            <div w-class="title-wrap">附加信息</div>
            <div w-class="detail-wrap">{{it.applyInfo}}</div>
        </div>
        {{if !it.isSolve}}
        <div w-class="agree-wrap">
            <span w-class="reject" on-tap="reject">拒绝</span>
            <span w-class="agree" on-tap="agree">同意</span>
        </div>
        {{else}}
        <div w-class="solved">{{it.isSolve}}</div>
        {{end}}
</div>