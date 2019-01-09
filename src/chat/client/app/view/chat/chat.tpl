<div class="new-page" ev-back-click="goBack" w-class="new-page" ev-send="send" ev-next-click="groupDetail">
    <chat-client-app-widget-topBar-topBar>{title:{{it.name}},nextImg:{{it.chatType=="group" ? "more-dot-blue.png":""}} }</chat-client-app-widget-topBar-topBar>
    
    <div w-class="messageBox" on-tap="pageClick">
        {{for i,v of it.hidIncArray}}
            <chat-client-app-widget-messageItem-messageItem>{hIncId: {{v}},name:{{it.name}},chatType:{{it.chatType}} }</chat-client-app-widget-messageItem-messageItem>
        {{end}} 

        {{if it.newMsg}}
        <div>
            <widget w-tag="chat-client-app-widget-messageItem-messageItem" style="float:right;">{{it.newMsg}}</widget>
            <img src="../../res/images/loading.gif" w-class="loading"/>
        </div>
        {{end}}

    </div>
    {{if it.lastAnnounce}}
    <div w-class="notice" ev-close-announce="closeAnnounce">
        <chat-client-app-view-group-latestAnnItem>{aIncId:{{it.lastAnnounce}}, gid:{{it.id}} }</chat-client-app-view-group-latestAnnItem>
    </div>
    {{end}}

    <div ev-open-Emoji="openEmoji" ev-input-focus="inputFocus" ev-input-change="msgChange" ev-emoji-click="pickEmoji" ev-open-Tools="openTools" ev-send-before="sendImgBefore">
        <widget w-tag="chat-client-app-widget-inputMessage-inputMessage">{isOnEmoji:{{it.isOnEmoji}},message:{{it.inputMessage}},isOnTools:{{it.isOnTools}} }</widget>  
    </div>
</div>

