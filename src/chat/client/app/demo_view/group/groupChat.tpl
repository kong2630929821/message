{{let len = it.aIncIdArray ? it.aIncIdArray.length : 0}}
<div class="new-page" w-class="new-page" ev-send="send" ev-back-click="goBack">
    <chat-client-app-widget-topBar-topBar>{title:{{it.groupName}},background:"#fff",nextImg:"more-dot-white.png"}</chat-client-app-widget-topBar-topBar>
    
    <div w-class="messageBox">
        {{for key,value of it.hidIncArray}}
            <chat-client-app-widget-messageItem-messageItem>{"hIncId": {{value}}, "chatType":"group" }</chat-client-app-widget-messageItem-messageItem>
        {{end}}
        <div id="messEnd"></div>
    </div>
    {{if len > 0}}
    <div w-class="notice">
        <chat-client-app-demo_view-group-latestAnnItem>{aIncId:{{it.aIncIdArray[len - 1]}}, gid:{{it.gid}} }</chat-client-app-demo_view-group-latestAnnItem>
    </div>
    {{end}}

    <chat-client-app-widget-inputMessage-inputMessage></chat-client-app-widget-inputMessage-inputMessage>
</div>
