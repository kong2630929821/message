<div class="new-page" ev-back-click="goBack">
    <client-app-widget-topBar-topBar>{title:"表情"}</client-app-widget-topBar-topBar>
    {{for key,value of it.emojis}}
        <img style="width:100px;height:100px;" src="{{value[1]}}" alt="{{value[0]}}" on-tap="click({{key}})" />
    {{end}}
</div> 