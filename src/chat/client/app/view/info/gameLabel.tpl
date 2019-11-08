<div class="new-page" style="background:#F9F9F9" ev-back-click="goBack">
    <chat-client-app-widget1-topBar-topBar>{title:"游戏标签"}</chat-client-app-widget1-topBar-topBar>
    <div w-class="listLabel">
        {{for i,v of it.gameLabelList}}
            <div w-class="labelItem" on-tap="check({{i}})">
                <img src="{{v.icon}}" alt="" w-class="checkLabelIcon"/>
                <div>{{v.name}}</div>
            </div>
        {{end}}
    </div>
</div>