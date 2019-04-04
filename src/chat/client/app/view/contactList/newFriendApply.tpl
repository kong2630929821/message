<div class="new-page">
    <div ev-back-click="goBack">
        <chat-client-app-widget-topBar-topBar>{title:{{it.title}} }</chat-client-app-widget-topBar-topBar>
    </div>
    <div w-class="newfriend-wrap" on-tap="goDetail">
        <div w-class="user">
            <widget w-tag="chat-client-app-widget-imgShow-imgShow" w-class="avatar" >{imgURL:{{it.avatar}},width:"80px;"}</widget>
            <span w-class="text">{{it.name}}</span>
            <img w-class="more" src="../../res/images/more-gray.png"/>
        </div>
    </div>
    <div w-class="attach-info-wrap">
        <div w-class="title-wrap">附加信息</div>
        <div w-class="detail-wrap">{{it.applyInfo}}</div>
    </div>
    {{if !it.isSolve}}
    <div w-class="agree-wrap">
        <span w-class="reject" on-tap="rejectBtn(e)">拒绝</span>
        <span w-class="agree" on-tap="agreeBtn(e)">同意</span>
    </div>
    {{else}}
    <div w-class="solved">{{it.isSolve}}</div>
    {{end}}
</div>