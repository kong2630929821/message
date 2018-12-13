<div on-tap="closeMessageRecall">
    {{if !it.msg.cancel && it.msg.mtype === 1}}
    <div style="overflow: hidden;">
    {{if it.me}}
    <div style="position:relative;margin: 10px 40px 0;float: right;" on-longtap="openMessageRecall">
        <div w-class="text-wrap">
            <widget w-tag="pi-ui-html" style="display: inline;">{{it.msg.msg}}</widget>
            <div w-class="corner">
                <span w-class="sendTime">{{it.time}}</span>
                <img w-class="isRead" src="../../res/images/{{it.msg.read ? 'readed' : 'unread'}}.png" />
            </div>
        </div>
        
        <span w-class="rightDownTail"></span>
        {{if it.isMessageRecallVisible}}
        <div style="position:absolute;top:0px;left:-240px;">
            <client-app-widget-messageRecall-messageRecall>{chatType:{{it.chatType}}, hidInc:{{it.hIncId}} }</client-app-widget-messageRecall-messageRecall>
        </div>
        {{end}}
    </div>
    {{else}}
    <div w-class="username">{{it.name}}</div>
    <div w-class="textMessage">
        <img src="../../res/images/user.png" w-class="avatar" on-tap="userDetail"/>
        <div>
            <div w-class="text-wrap" style="color:#222222;background:#fff;">
                <widget w-tag="pi-ui-html" style="display: inline;">{{it.msg.msg}}</widget>
                <div w-class="corner">
                    <span w-class="sendTime" style="color:#297FCA">{{it.time}}</span>
                </div>
            </div>
            
            <span w-class="leftDownTail"></span>
        </div>
    </div>
    {{end}}
    </div>
    {{end}}
</div>
