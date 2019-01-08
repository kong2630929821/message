<div>
    {{if !it.msg.cancel && it.msg.mtype < 5 || it.msg.mtype == 9}}
    <div style="overflow: hidden;">
        {{if it.me}}
        <div style="position:relative;margin: 10px 40px 0;float: right;">
            {{if it.msg.mtype == 9}}
            <widget w-tag="chat-client-app-widget-nameCard-nameCard" on-tap="openRedEnvelope">{cardInfo:{{it.msg.msg}},cardType:"redEnv"}</widget>
            <span w-class="rightDownTail" style="border-top: 10px solid #fff;"></span>

            {{else}}
            <div w-class="text-wrap" on-longtap="openMessageRecall" on-tap="msgDetailClick(e)">
                <widget w-tag="pi-ui-html" style="display: inline;white-space: pre-wrap;">{{it.msg.msg}}</widget>
                <div w-class="corner">
                    <span w-class="sendTime">{{it.time}}</span>
                    <img w-class="isRead" src="../../res/images/{{it.msg.read ? 'readed' : 'unread'}}.png" />
                </div>
            </div>
            <span w-class="rightDownTail"></span>
            {{end}}

            {{if it.isMessageRecallVisible}}
            <div style="position:absolute;bottom: 0;left:-150px;">
                <div w-class="recallBtn" on-tap="recall">撤回</div>
            </div>
            {{end}}
        </div>

        {{else}}
        <div w-class="username">{{it.name}}</div>
        <div style="display:flex;margin:10px 20px;">
            <img src="../../res/images/user.png" w-class="avatar" on-tap="userDetail"/>
            {{if it.msg.mtype == 9}}
            <span w-class="leftDownTail" style="border-bottom:10px solid rgba(235,79,79,1)"></span>
            <widget w-tag="chat-client-app-widget-nameCard-nameCard" on-tap="openRedEnvelope">{cardInfo:{{it.msg.msg}},cardType:"redEnv"}</widget>
            {{else}}
            <span w-class="leftDownTail"></span>
            <div w-class="text-wrap" style="color:#222222;background:#fff;" on-longtap="openMessageRecall" on-tap="msgDetailClick(e)">
                <widget w-tag="pi-ui-html" style="display: inline;white-space: pre-wrap;">{{it.msg.msg}}</widget>
                <div w-class="corner">
                    <span w-class="sendTime" style="color:#297FCA">{{it.time}}</span>
                </div>
            </div>
            {{end}}
        </div>
        {{end}}
    </div>

    {{elseif it.msg.mtype == 5}}
    <div w-class="recallMsg">{{it.me ? "你" : it.name}}撤回了一条消息</div>
    {{elseif it.msg.mtype == 8}}
    <div w-class="recallMsg" style="font-size:32px;">你们已经成为好友，开始聊天吧</div>
    {{end}}
</div>
