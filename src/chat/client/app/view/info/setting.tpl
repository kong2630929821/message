<div class="new-page" style="background:#F9F9F9" ev-back-click="goBack">
    <chat-client-app-widget-topBar-topBar>{title:"消息设置"}</chat-client-app-widget-topBar-topBar>
    {{for i,v of it.setList}}
        {{if i%3==0}}
        <div w-class="divide"></div>
        {{end}}
    <div w-class="item" on-tap="itemClick({{i}})">
        <div w-class="itemName">{{v[0]}}</div>
        {{if v[1]}}
        <div ev-switch-click="switchClick(e,{{i}})">
            <widget w-tag="chat-client-app-widget-switch-switch">{types:false}</widget>
        </div>
        {{else}}
            {{if v[2]}}
            <div w-class="itemDesc">{{v[2]}}</div>
            {{end}}
        <img src="../../res/images/arrowRight.png"/>
        {{end}}
    </div>
    {{end}}
</div>