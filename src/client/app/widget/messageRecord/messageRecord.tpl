<div w-class="message-record-wrap">
    <div w-class="avator-wrap">
        <img w-class="avator" src="../../res/images/user.png" />
    </div>
    <div w-class="user-info-wrap">
        <div w-class="info-wrap">
            {{if it.isGroupMessage}}
            <img w-class="resIcon" src="../../res/images/group-icon.png" />
            {{end}}
            <span w-class="userName">{{it.name}}</span>
            {{if it.isNotDisturb}}
            <img w-class="notDisturbIcon" src="../../res/images/not-disturb.png" />
            {{end}}
        </div>
        <div w-class="recordInfo">{{it.lastMessage.msg}}</div>
    </div>
    <div w-class="right-wrap">
        <span w-class="recordTime">{{it.time}}</span>
        {{if it.unReadCount}}
        <span w-class="unread" style="background:{{it.isNotDisturb ? '#ccc' : '#F7931A'}}">{{it.unReadCount}}</span>
        {{end}}
    </div>
</div>
            