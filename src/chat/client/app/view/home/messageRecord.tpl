<div w-class="message-record-wrap" style="background-color:{{it.msgTop?'#f0f0f0;':'#fff'}}" on-tap="clearUnread">
    <div w-class="avatar-wrap">
        <widget w-tag="chat-client-app-widget-imgShow-imgShow" w-class="avatar" >{imgURL:{{it.avatar}},width:"80px;"}</widget>
    </div>
    <div w-class="user-info-wrap">
        <div w-class="info-wrap">
            {{if it.chatType == "group"}}
            <img w-class="resIcon" src="../../res/images/group-icon.png" />
            {{end}}
            <span w-class="userName">{{it.name}}</span>
            {{if it.official}}
                <span w-class="official">官方</span>
            {{end}}
        
            {{if it.msgAvoid}}
            <img w-class="notDisturbIcon" src="../../res/images/not-disturb.png" />
            {{end}}
        </div>
        <div w-class="recordInfo">{{it.msg}}</div>
    </div>
    <div w-class="right-wrap">
        <span w-class="recordTime">{{it.time}}</span>
        {{if it.unReadCount}}
        <span w-class="unread" style="background:{{it.msgAvoid ? '#ccc' : '#F7931A'}}">{{it.unReadCount}}</span>
        {{end}}
    </div>
</div>
            