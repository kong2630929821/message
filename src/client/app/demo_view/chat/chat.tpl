<div class="new-page" ev-back-click="goBack" w-class="new-page">
    <client-app-widget-topBar-topBar>{title:{{it.name}}}</client-app-widget-topBar-topBar>
    <div w-class="messageBox" on-scroll="">
        {{for i,v of it.hidIncArray}}
            <client-app-widget-messageItem-messageItem>{hIncId: {{v}},name:{{it.name}},chatType:"user" }</client-app-widget-messageItem-messageItem>
        {{end}} 
        <div id="messEnd"></div>
    </div>
    <div ev-send="send" style="height:120px;">
        <client-app-widget-inputMessage-inputMessage></client-app-widget-inputMessage-inputMessage>
    </div>    
</div>

