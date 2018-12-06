<div class="new-page" ev-back-click="goBack">
    <client-app-widget-topBar-topBar>{title:{{it.rid}}}</client-app-widget-topBar-topBar>
    
    {{for key,value of it.hidIncArray}}
        <client-app-demo_view-chat-chatItem>{"hIncId": {{value}}, "chatType":"group" }</client-app-demo_view-chat-chatItem>
    {{end}} 
    <client-app-widget-messageItem-messageItem></client-app-widget-messageItem-messageItem>
    <client-app-widget-messageItem-messageItem></client-app-widget-messageItem-messageItem>
    <div w-class="login-chat-wrap">
        群组聊天
    </div>
    <div ev-send="send">
        <client-app-widget-inputMessage-inputMessage></client-app-widget-inputMessage-inputMessage>
    </div>    
</div>

