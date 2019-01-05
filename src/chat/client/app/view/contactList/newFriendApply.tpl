<div class="new-page">
    <div ev-back-click="goBack">
        <chat-client-app-widget-topBar-topBar>{title:{{it.title}} }</chat-client-app-widget-topBar-topBar>
    </div>
    <div w-class="newfriend-wrap" on-tap="goDetail">
        <chat-client-app-widget-featureBar-featureBar>{iconPath:"user.png",text:{{it.name}} }</chat-client-app-widget-featureBar-featureBar>
    </div>
    <div w-class="attach-info-wrap">
        <div w-class="title-wrap">附加信息</div>
        <div w-class="detail-wrap">{{it.applyInfo}}</div>
    </div>
    {{if !it.isSolve}}
    <div w-class="agree-wrap">
        <span w-class="reject" on-tap="rejectBtn">拒绝</span>
        <span w-class="agree" on-tap="agreeBtn">同意</span>
    </div>
    {{else}}
    <div w-class="solved">{{it.isSolve}}</div>
    {{end}}
</div>