<div w-class="message-record-wrap" style="background-color:{{it.msgTop?'#F9F9F9;':'#fff'}}" on-tap="clearUnread" on-longtap="changeUtils" on-down="onShow" on-up="onRemove">
    <div w-class="topFlag"></div>
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

    {{if it.showUtils}}
    <div w-class="utils">
        <div w-class="util" on-tap="msgTop">{{it.msgTop?"取消置顶":"置顶"}}</div>
        <div w-class="util" on-tap="msgAvoid">{{it.msgAvoid?"打开消息提醒":"消息免打扰"}}</div>
        <div w-class="util" on-tap="delete">删除</div>
    </div>
    {{end}}
</div>
            