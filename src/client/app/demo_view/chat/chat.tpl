<div class="new-page" ev-back-click="goBack" w-class="new-page">
    <client-app-widget-topBar-topBar>{title:{{it.name}}}</client-app-widget-topBar-topBar>
    <div w-class="messageBox">
        {{for i,v of it.hidIncArray}}
            <client-app-demo_view-chat-textMessage>{hIncId: {{v}},name:{{it.name}} }</client-app-demo_view-chat-textMessage>
        {{end}} 
        <div id="messEnd"></div>
    </div>
    <div ev-send="send" style="height:120px;">
        <widget w-tag="client-app-widget-inputMessage-inputMessage"></widget>
    </div>    
</div>

