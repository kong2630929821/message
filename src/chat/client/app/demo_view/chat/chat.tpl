<div class="new-page" ev-back-click="goBack" w-class="new-page" ev-send="send" >
    <chat-client-app-widget-topBar-topBar>{title:{{it.name}}}</chat-client-app-widget-topBar-topBar>
    
    <div w-class="messageBox" ev-avatar-click="goUserDetail" on-tap="pageClick">
        {{for i,v of it.hidIncArray}}
            <chat-client-app-widget-messageItem-messageItem>{hIncId: {{v}},name:{{it.name}},chatType:{{it.chatType}} }</chat-client-app-widget-messageItem-messageItem>
        {{end}} 
        <div id="messEnd"></div>
    </div>
    {{if it.lastAnnounce}}
    <div w-class="notice" ev-close-announce="closeAnnounce">
        <chat-client-app-demo_view-group-latestAnnItem>{aIncId:{{it.lastAnnounce}}, gid:{{it.id}} }</chat-client-app-demo_view-group-latestAnnItem>
    </div>
    {{end}}

    <div ev-open-Emoji="openEmoji" ev-input-focus="inputFocus" ev-input-change="msgChange" ev-emoji-click="pickEmoji">
        <widget w-tag="chat-client-app-widget-inputMessage-inputMessage">{isOnEmoji:{{it.isOnEmoji}},message:{{it.inputMessage}} }</widget>  
    </div>
</div>

