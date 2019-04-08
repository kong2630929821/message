<div class="new-page" ev-back-click="goBack" w-class="new-page" ev-send="send" ev-next-click="groupDetail">
    <chat-client-app-widget-topBar-topBar>{title:{{it.name}},nextImg:{{it.chatType=="group" ? "more-dot-blue.png":""}} }</chat-client-app-widget-topBar-topBar>
    
    {{if it.lastAnnounce}}
    <div style="height:128px;" ev-close-announce="closeAnnounce">
        <chat-client-app-view-group-latestAnnItem>{aIncId:{{it.lastAnnounce}}, gid:{{it.id}} }</chat-client-app-view-group-latestAnnItem>
    </div>
    {{end}}

    {{if it.temporary || it.groupId}}
    <div w-class="temporaryBox">
        <widget w-tag="chat-client-app-widget-imgShow-imgShow" w-class="avatar">{imgURL:{{it.avatar}},width:"80px;"}</widget>
        <div style="flex:1;">
            <div>{{it.name}}</div>
            <div style="font-size: 24px;color: #888888;">你们还不是好友</div>
        </div>
        <div w-class="addUser" on-tap="addUser">+好友</div>
    </div>
    {{end}}

    <div w-class="messageBox" on-tap="pageClick" ev-messItem-radio="stopRadio" ev-delelte-user="goBack" id="chatMessageBox" on-scroll="scrollMessBox">
        {{for i,v of it.showHincIdArray}}
            <chat-client-app-widget-messageItem-messageItem>{hIncId: {{v}},name:{{it.name}},chatType:{{it.chatType}},playRadio: {{it.onRadio && v == it.onRadio.hIncId ? it.onRadio.playRadio : false}} }</chat-client-app-widget-messageItem-messageItem>
        {{end}} 

        {{if it.newMsg}}
        <div>
            <widget w-tag="chat-client-app-widget-messageItem-messageItem" style="float:right;">{{it.newMsg}}</widget>
            <img src="../../res/images/loading.gif" w-class="loading"/>
        </div>
        {{end}}

    </div>

    <div ev-open-Emoji="openEmoji" ev-input-focus="inputFocus" ev-input-change="msgChange" ev-emoji-click="pickEmoji" ev-open-Tools="openTools" ev-send-before="sendImgBefore">
        <widget w-tag="chat-client-app-widget-inputMessage-inputMessage">{isOnEmoji:{{it.isOnEmoji}},message:{{it.inputMessage}},isOnTools:{{it.isOnTools}},chatType:{{it.chatType}} }</widget>  
    </div>
</div>

