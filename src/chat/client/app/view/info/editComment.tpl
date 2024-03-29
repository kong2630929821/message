<div class="new-page" w-class="page">
    <app-publicComponents-blankDiv-topDiv></app-publicComponents-blankDiv-topDiv>
    <div w-class="topBar">
        <div w-class="topBarItem" on-tap="close">取消</div>
        <div w-class="topBarItem">{{it.title}}</div>
        <div w-class="topBarItem" style="color:#4285F4" on-tap="send">发送</div>
    </div>
    <div w-class="content" ev-input-change="contentChange">
        <widget w-tag="chat-client-app-widget1-input-textarea">{placeHolder:{{it.placeholder}}, style:"max-height:300px;height:300px;font-size:28px;", input:{{it.contentInput}},maxLength:100 }</widget>
    </div>

    {{if it.mess}}
    <div w-class="orgComment">
        <widget w-tag="chat-client-app-widget1-imgShow-imgShow" w-class="img">{imgURL:{{it.avatar || "../../res/images/user_avatar.png"}}, width:"150px;",notRound:true}</widget>
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
    <div w-class="imageList">
        {{for i,v of it.uploadLoding}}
        {{if v}}
            <div w-class="upload" style="background-image:url(../../res/images/loading.gif)"></div>
        {{else}}
            <div w-class="imgBox">
                <pi-ui-html style="display:inline-block;margin: 5px;">{{it.imgs[i]}}</pi-ui-html>
                <img src="../../res/images/remove.png" w-class="close" on-tap="delImage({{i}})"/>
            </div>
        {{end}}
        
        {{end}}
        {{if it.uploadLoding.length < 1 }}
        <div w-class="upload" on-tap="chooseImage"></div>
        {{end}}
    </div>
    <div w-class="tools" ev-emoji-click="pickEmoji">
        <div>
            <img src="{{it.showType[0]?'../../res/images/emoji.png':'../../res/images/emojiblue.png'}}" w-class="btn" on-tap="openEmoji"/>
            <img src="{{it.showType[1]?'../../res/images/tool-pictures.png':'../../res/images/tool-picturesBlue.png'}}" w-class="btn" on-tap="chooseImage"/>
        </div>

        <widget w-tag="chat-client-app-widget1-emoji-emoji" w-class="emojiMap" id="emojiMap" style="display:{{it.isOnEmoji ? 'block' : 'none'}}"></widget>
    </div>
</div>