<div>
    {{if !it.message.cancel && it.message.mtype < 5 || it.message.mtype == 9 || it.message.mtype == 13 || it.message.mtype == 14 || it.message.mtype == 15}}
    <div style="overflow: hidden;">
        {{if it.me}}
        <div style="position:relative;margin: 10px 20px 0;float: right;display:flex;">

            {{% ========================红包=========================}}
            {{if it.message.mtype == 9}}
            <widget w-tag="chat-client-app-widget1-nameCard-nameCard" on-tap="openRedEnvelope">{cardInfo:{{it.message.msg}},cardType:"redEnv",received:{{!!it.message.redEnvDetail}} }</widget>
            <span w-class="rightDownTail" style="border-top: 10px solid #fff;"></span>

            {{% ========================图片=========================}}
            {{elseif it.message.mtype == 2}}
            <div w-class="img-wrap" on-tap="openBigImage" on-longtap="openMessageRecall">
                <widget w-tag="pi-ui-html" w-class="pi-html">{{it.message.msg.compressImg}}</widget>
                <div w-class="imgCorner">
                    <span style="color:rgba(187, 229, 254, 1)">{{it.time}}</span>
                    {{if it.chatType == "user"}}
                    <img w-class="isRead" src="../../res/images/{{it.message.read ? 'readed' : 'unread'}}.png" />
                    {{end}}
                </div>
            </div>
           
            {{% ========================语音=========================}}
            {{elseif it.message.mtype == 3}}
            <div w-class="radio-wrap" on-tap="playRadioMess" style="width:{{it.message.width * 4 + 250}}px;" on-longtap="openMessageRecall">
                <img w-class="playBtn" src="../../res/images/{{it.playAudio?'stop-radio.png':'play-radio.png'}}"/>
                <widget w-tag="pi-ui-html" w-class="pi-html" style="flex:1 0 0;">{{it.message.msg}}</widget>
                
                <div w-class="corner">
                    <span w-class="sendTime">{{it.time}}</span>
                    {{if it.chatType == "user"}}
                    <img w-class="isRead" src="../../res/images/{{it.message.read ? 'readed' : 'unread'}}.png" />
                    {{end}}
                </div>
            </div>
            <span w-class="rightDownTail"></span>

            {{% ========================文章=========================}}
            {{elseif it.message.mtype == 14}}
            <div w-class="text-wrap" style="color:#222222;background:#fff;" on-tap="openArticle">
                <div style="font-weight:500;">{{it.message.msg.title}}</div>
                <div style="display:flex;align-items: center;">
                    <div w-class="article">{{it.message.msg.content}}</div>
                    <widget w-tag="chat-client-app-widget1-imgShow-imgShow" w-class="image">{imgURL:{{it.message.image}}, width:"100px",notRound:true}</widget>
                </div>
            </div>

            {{% ========================名片=========================}}
            {{elseif it.message.mtype == 15}}
            <widget w-tag="chat-client-app-widget1-nameCard-nameCard" on-tap="goDetail">{cardInfo:{{it.message.msg.name}},cardType:"namecard",cardTypeShow:{{it.message.msg.type}},avatarPath:{{it.message.image}} }</widget>
           
            {{% =====================其他消息类型======================}}
            {{else}}
            <div w-class="text-wrap" on-longtap="openMessageRecall" on-tap="msgDetailClick">
                <widget w-tag="pi-ui-html" w-class="pi-html">{{it.message.msg}}</widget>
                <div w-class="corner">
                    <span w-class="sendTime">{{it.time}}</span>
                    {{if it.chatType == "user"}}
                    <img w-class="isRead" src="../../res/images/{{it.message.read ? 'readed' : 'unread'}}.png" />
                    {{end}}
                </div>
            </div>
            <span w-class="rightDownTail"></span>
            {{end}}

            {{% ========================撤回按钮=========================}}
            {{if it.recallBtn}}
            <div style="position:absolute;bottom: 5px;left:-30px;">
                <div w-class="recallBtn" on-tap="recall">撤回</div>
            </div>
            {{end}}

            <widget w-tag="chat-client-app-widget1-imgShow-imgShow" style="margin-left:10px;" on-tap="userDetail(e,true)">{imgURL:{{it.myAvatar}},width:"80px;"}</widget>
        </div>

        {{% ==========================被拒绝的消息标志=====================}}
        {{if it.refusedMsg}}
        <img src="../../res/images/refusedMsg.png" w-class="loading"/>
        {{end}}

        {{% ========================对方发送的消息=========================}}
        {{else}}
        <div w-class="username">{{it.name || "------"}}</div>
        <div style="display:flex;margin:10px 20px;">
            <widget w-tag="chat-client-app-widget1-imgShow-imgShow" w-class="avatar" on-tap="userDetail">{imgURL:{{it.avatar}},width:"80px;"}</widget>

            {{% ========================红包=========================}}
            {{if it.message.mtype == 9}}
            <span w-class="leftDownTail" style="border-bottom:10px solid rgba(235,79,79,1)"></span>
            <widget w-tag="chat-client-app-widget1-nameCard-nameCard" on-tap="openRedEnvelope">{cardInfo:{{it.message.msg}},cardType:"redEnv",received:{{!!it.message.redEnvDetail}} }</widget>
            
            {{% ========================图片=========================}}
            {{elseif it.message.mtype == 2}}
            <div w-class="img-wrap" on-tap="openBigImage">
                <widget w-tag="pi-ui-html" w-class="pi-html">{{it.message.msg.compressImg}}</widget>
                <div w-class="imgCorner">
                    <span style="color:rgba(187, 229, 254, 1)">{{it.time}}</span>
                </div>
            </div>
            
            {{% ========================语音=========================}}
            {{elseif it.message.mtype == 3}}
            <span w-class="leftDownTail"></span>
            <div w-class="radio-wrap" style="color:#222222;background:#fff;width:{{it.message.width * 4 + 250}}px;" on-tap="playRadioMess">
                <img w-class="playBtn" src="../../res/images/{{it.playAudio?'stop-radio.png':'play-radio.png'}}" class="audioImage"/>
                <widget w-tag="pi-ui-html" w-class="pi-html" style="flex:1 0 0;">{{it.message.msg}}</widget>
                <div w-class="corner">
                    <span w-class="sendTime" style="color:#297FCA">{{it.time}}</span>
                </div>
            </div>

            {{% ========================文章=========================}}
            {{elseif it.message.mtype == 14}}
            <div w-class="text-wrap" style="color:#222222;background:#fff;" on-tap="openArticle">
                <div style="font-weight:500;">{{it.message.msg.title}}</div>
                <div style="display:flex;align-items: center;">
                    <div w-class="article">{{it.message.msg.content}}</div>
                    <widget w-tag="chat-client-app-widget1-imgShow-imgShow" w-class="image">{imgURL:{{it.message.image}}, width:"100px",notRound:true}</widget>
                </div>
            </div>

            {{% ========================名片=========================}}
            {{elseif it.message.mtype == 15}}
            <widget w-tag="chat-client-app-widget1-nameCard-nameCard" on-tap="goDetail">{cardInfo:{{it.message.msg.name}},cardType:"namecard",cardTypeShow:{{it.message.msg.type}},avatarPath:{{it.message.image}} }</widget>

            {{% ========================其他消息类型=========================}}
            {{else}}
            <span w-class="leftDownTail"></span>
            <div w-class="text-wrap" style="color:#222222;background:#fff;" on-tap="msgDetailClick">
                <widget w-tag="pi-ui-html" w-class="pi-html">{{it.message.msg}}</widget>
                <div w-class="corner">
                    <span w-class="sendTime" style="color:#297FCA">{{it.time}}</span>
                </div>
            </div>
            {{end}}
        </div>
        {{end}}
    </div>

    {{% ========================撤回消息=========================}}
    {{elseif it.message.mtype == 5}}
    <div w-class="recallMsg">{{it.me ? "你" : (it.name || "------") }}撤回了一条消息</div>

    {{% =================添加好友或创建群成功或群其他设置提示==================}}
    {{elseif it.message.mtype == 8 || it.message.mtype == 10 || it.message.mtype == 12}}
    <div w-class="recallMsg" style="font-size:32px;">{{it.message.msg}}</div>

    {{% ========================加群成功提示=========================}}
    {{elseif it.message.mtype == 11}}
    <div w-class="recallMsg" style="font-size:32px;">{{it.me ? "你" : (it.name || "------") }}已成功加入群组</div>

    {{% ========================分享文章卡片=========================}}
    {{elseif it.message.mtype == 14}}
    <div w-class="recallMsg" style="font-size:32px;">分享了一篇文章</div>
    {{end}}
</div>
