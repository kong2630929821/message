<div>
    {{if it.me}}
    <div style="margin: 10px 40px 0;float: right;">
        <div w-class="text-wrap">
            <widget w-tag="pi-ui-html" style="display: inline;">{{it.msg.msg}}</widget>
            <div w-class="corner">
                <span w-class="sendTime">{{it.time}}</span>
                <img w-class="isRead" src="../../res/images/{{it.msg.read ? 'readed' : 'unread'}}.png" />
            </div>
        </div>
        
        <span w-class="rightDownTail"></span>
    </div>
    {{else}}
    <div w-class="username">{{it.name || it.msg.sid}}</div>
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