<div class="new-page" ev-back-click="goBack" w-class="new-page" ev-send="send" ev-next-click="groupDetail">
    <chat-client-app-widget1-topBar-topBar>{title:{{it.name}},text:{{it.text}},nextImg:{{it.chatType=="group" ? "more-dot-blue.png":""}} }</chat-client-app-widget1-topBar-topBar>
    
    {{if it.lastAnnounce}}
    <div style="height:128px;" ev-close-announce="closeAnnounce">
        <chat-client-app-view-group-latestAnnItem>{aIncId:{{it.lastAnnounce}}, gid:{{it.id}} }</chat-client-app-view-group-latestAnnItem>
    </div>
    {{end}}

    <div w-class="messageBox" on-tap="pageClick" ev-messItem-radio="playRadio" ev-delelte-user="goBack" id="chatMessageBox" on-scroll="scrollMessBox" ev-recall="openMessageRecall">
        {{if it.notFollowed}}
        <div w-class="notfollow">
            <span>未关注用户，立即</span>
            <span w-class="followBtn" on-tap="goDetail">关注对方</span>
        </div>
        {{end}}

        {{for i,v of it.showHincIdArray}}
            <chat-client-app-widget1-messageItem-messageItem>{hIncId: {{v}},name:{{it.name}},chatType:{{it.chatType}},playAudio: {{it.activeAudio && v == it.activeAudio.hIncId ? it.activeAudio.playAudio : false}}, recallBtn:{{it.activeMessId == v}} }</chat-client-app-widget1-messageItem-messageItem>
        {{end}} 

        {{if it.newMsg}}
        <div>
            <widget w-tag="chat-client-app-widget1-messageItem-messageItem" style="float:right;">{{it.newMsg}}</widget>
            <img src="../../res/images/loading.gif" w-class="loading"/>
        </div>
        {{end}}

    </div>

    <div ev-open-Emoji="openEmoji" ev-input-focus="inputFocus" ev-input-change="msgChange" ev-emoji-click="pickEmoji" ev-open-Tools="openTools" ev-send-before="sendImgBefore" ev-open-audio="openAudio">
        <widget w-tag="chat-client-app-widget1-inputMessage-inputMessage">{isOnEmoji:{{it.isOnEmoji}},message:{{it.inputMessage}},isOnTools:{{it.isOnTools}},isOnAudio:{{it.isOnAudio}},chatType:{{it.chatType}} }</widget>  
    </div>
</div>

