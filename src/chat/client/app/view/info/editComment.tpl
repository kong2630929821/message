<div class="new-page" w-class="page">
    <app-components1-blankDiv-topDiv></app-components1-blankDiv-topDiv>
    <div w-class="topBar">
        <div w-class="topBarItem" on-tap="close">取消</div>
        <div w-class="topBarItem">"回复"</div>
        <div w-class="topBarItem" style="color:#888888" on-tap="send">发送</div>
    </div>
    <div w-class="content" ev-input-change="contentChange">
        <widget w-tag="chat-client-app-widget-input-textarea">{placeHolder:{{it.placeholder}}, style:"max-height:300px;height:300px;font-size:28px;", input:{{it.contentInput}} }</widget>
    </div>

    {{if it.showOrg}}
    <div w-class="orgComment">
        <widget w-tag="chat-client-app-widget-imgShow-imgShow" w-class="img">{imgURL:{{it.img}}, width:"150px;",notRound:true}</widget>
        <div style="border-bottom: 1px solid #F2F2F2;">
            <div w-class="username">
                <span>@{{it.username}}&nbsp;</span>
                {{if it.offical}}
                <div>官方</div>
                {{else}}
                <img src="../../res/images/{{it.sex?'girl.png':'boy.png'}}"/>
                {{end}}
            </div>
            <div w-class="comment">{{it.comment}}</div>
        </div>
    </div>
    {{end}}
    
    <div w-class="btns">
        <img src="../../res/images/emoji.png" w-class="btn" on-tap="openEmoji"/>
        <img src="../../res/images/tool-camera.png" w-class="btn"/>
    </div>
</div>