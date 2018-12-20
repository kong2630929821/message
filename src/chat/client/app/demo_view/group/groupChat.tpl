<div class="new-page" w-class="new-page" ev-send="send" ev-back-click="goBack">
    <chat-client-app-widget-topBar-topBar>{title:{{it.groupName}},nextImg:"more-dot-white.png"}</chat-client-app-widget-topBar-topBar>
    
    <div w-class="messageBox">
        {{for key,value of it.hidIncArray}}
            <chat-client-app-widget-messageItem-messageItem>{"hIncId": {{value}}, "chatType":"group" }</chat-client-app-widget-messageItem-messageItem>
        {{end}}
        <div id="messEnd"></div>
    </div>
    {{if it.lastAnnounce}}
    <div w-class="notice" ev-close-announce="closeAnnounce">
        <chat-client-app-demo_view-group-latestAnnItem>{aIncId:{{it.lastAnnounce}}, gid:{{it.gid}} }</chat-client-app-demo_view-group-latestAnnItem>
    </div>
    {{end}}

    <div>
        <widget w-tag="chat-client-app-widget-inputMessage-inputMessage"></widget>  
    </div>
</div>
