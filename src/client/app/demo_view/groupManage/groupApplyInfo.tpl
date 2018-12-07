<div style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
        <div ev-back-click="goBack">     
            <client-app-widget-topBar-topBar>{title:"入群申请",background:"#fff"}</client-app-widget-topBar-topBar>
        </div>
        <div w-class="newfriend-wrap">
            <client-app-widget-featureBar-featureBar>{iconPath:"user.png",text:{{it.name}}}</client-app-widget-featureBar-featureBar>
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