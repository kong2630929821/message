<div class="new-page" ev-back-click="goBack">
    <chat-client-app-widget-topBar-topBar>{title:{{it.rid}}}</chat-client-app-widget-topBar-topBar>
    
    {{for key,value of it.hidIncArray}}
        <chat-client-app-demo_view-chat-chatItem>{"hIncId": {{value}}, "chatType":"group" }</chat-client-app-demo_view-chat-chatItem>
    {{end}} 
    <chat-client-app-widget-messageItem-messageItem></chat-client-app-widget-messageItem-messageItem>
    <chat-client-app-widget-messageItem-messageItem></chat-client-app-widget-messageItem-messageItem>
    <div w-class="login-chat-wrap">
        群组聊天
    </div>
    <div ev-send="send">
        <chat-client-app-widget-inputMessage-inputMessage></chat-client-app-widget-inputMessage-inputMessage>
    </div>    
</div>

