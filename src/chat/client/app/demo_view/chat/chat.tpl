<div class="new-page" ev-back-click="goBack" w-class="new-page" ev-send="send" >
    <chat-client-app-widget-topBar-topBar>{title:{{it.name}}}</chat-client-app-widget-topBar-topBar>
    
    <div w-class="messageBox" on-tap="pageClick">
        {{for i,v of it.hidIncArray}}
            <chat-client-app-widget-messageItem-messageItem>{hIncId: {{v}},name:{{it.name}},chatType:{{it.chatType}} }</chat-client-app-widget-messageItem-messageItem>
        {{end}} 

        {{if it.newMsg}}
        <div>
            <div w-class="newMsg">
                <div w-class="text-wrap">
                    <widget w-tag="pi-ui-html" style="display: inline;white-space: pre-wrap;">{{it.newMsg.msg}}</widget>
                    <div w-class="corner">
                        <span w-class="sendTime">{{it.newMsg.time}}</span>
                        <img w-class="isRead" src="../../res/images/unread.png" />
                    </div>
                </div>
                <span w-class="rightDownTail"></span>
            </div>
            <img src="../../res/images/loading.gif" w-class="loading"/>
        </div>
        {{end}}

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

