<div style="overflow: auto;">
    {{if it.me}}
    <div style="margin: 10px 50px 0;float: right;">
        <div w-class="text-wrap">
            {{it.msg.msg}}
            <div w-class="corner">
                <span w-class="sendTime">{{it.time}}</span>
                <img w-class="isRead" src="../../res/images/{{it.msg.read ? 'readed' : 'unread'}}.png" />
            </div>
        </div>
        
        <span w-class="rightDownTail"></span>
    </div>
    {{else}}
    <div w-class="username">{{it.name}}</div>
    <div w-class="textMessage">
        <img src="../../res/images/user.png" w-class="avatar"/>
        <div>
            <div w-class="text-wrap" style="color:#222222;background:#fff;">
                {{it.msg.msg}}
                <div w-class="corner">
                    <span w-class="sendTime">{{it.time}}</span>
                </div>
            </div>
            
            <span w-class="leftDownTail"></span>
        </div>
    </div>
    {{end}}
</div>