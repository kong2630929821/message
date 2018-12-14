<div class="new-page" ev-back-click="goBack" w-class="new-page">
    <chat-client-app-widget-topBar-topBar>{title:{{it.name}}}</chat-client-app-widget-topBar-topBar>
    <div w-class="messageBox" ev-avatar-click="goUserDetail" ev-send="send">
        {{for i,v of it.hidIncArray}}
            <chat-client-app-widget-messageItem-messageItem>{hIncId: {{v}},name:{{it.name}},chatType:"user"  }</chat-client-app-widget-messageItem-messageItem>
        {{end}} 
        <div id="messEnd"></div>
    </div>
    <div ev-send="send" >
        <widget w-tag="chat-client-app-widget-inputMessage-inputMessage"></widget>
    </div>    
</div>

