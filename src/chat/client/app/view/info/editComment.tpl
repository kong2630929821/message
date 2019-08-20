<div class="new-page" w-class="page">
    <app-components1-blankDiv-topDiv></app-components1-blankDiv-topDiv>
    <div w-class="topBar">
        <div w-class="topBarItem" on-tap="close">取消</div>
        <div w-class="topBarItem">{{it.title}}</div>
        <div w-class="topBarItem" style="color:#888888" on-tap="send">发送</div>
    </div>
    <div w-class="content" ev-input-change="contentChange">
        <widget w-tag="chat-client-app-widget-input-textarea">{placeHolder:{{it.placeholder}}, style:"max-height:300px;height:300px;font-size:28px;", input:{{it.contentInput}},maxLength:100 }</widget>
    </div>

    {{if it.mess}}
    <div w-class="orgComment">
        <widget w-tag="chat-client-app-widget-imgShow-imgShow" w-class="img">{imgURL:{{it.avatar || "../../res/images/user_avatar.png"}}, width:"150px;",notRound:true}</widget>
        <div style="border-bottom: 1px solid #F2F2F2;">
            <div w-class="username">
                <span>@{{it.username}}&nbsp;</span>
                {{if it.offical}}
                <div>官方</div>
                {{else}}
                <img src="../../res/images/{{it.gender?'girl.png':'boy.png'}}"/>
                {{end}}
            </div>
            <div w-class="comment">
                <widget w-tag="pi-ui-html">{{it.mess}}</widget>
            </div>
        </div>
    </div>
    {{end}}
    
    <div w-class="tools" ev-emoji-click="pickEmoji">
        <div>
            <img src="../../res/images/emoji.png" w-class="btn" on-tap="openEmoji"/>
            <img src="../../res/images/tool-camera.png" w-class="btn" on-tap="chooseImage"/>
        </div>

        <widget w-tag="chat-client-app-widget-emoji-emoji" w-class="emojiMap" id="emojiMap" style="display:{{it.isOnEmoji ? 'block' : 'none'}}"></widget>
    </div>
</div>