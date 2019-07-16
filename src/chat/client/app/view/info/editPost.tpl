<div class="new-page" w-class="page">
    <app-components1-blankDiv-topDiv></app-components1-blankDiv-topDiv>
    <div w-class="topBar">
        <div w-class="topBarItem" on-tap="close">取消</div>
        <div w-class="topBarItem">{{it.title}}</div>
        <div w-class="topBarItem" style="color:#888888" on-tap="send">发布</div>
    </div>
    <div w-class="contain">
        {{if it.isPublic}}
        <div w-class="title">
            <widget w-tag="chat-client-app-widget-input-input">{placeHolder:"标题1-24个字",input:{{it.titleInput}} }</widget>
        </div>
        {{end}}
        <div w-class="content">
            <widget w-tag="chat-client-app-widget-input-textarea">{placeHolder:"内容", style:"max-height:300px;height:300px;font-size:28px;", input:{{it.contentInput}} }</widget>
        </div>
        
        {{% ========================上传图片======================}}
        <div w-class="imageList">
            {{for i,v of it.imgs}}
            <div w-class="imgBox">
                <widget w-tag="chat-client-app-widget-imgShow-imgShow" w-class="img">{imgURL:{{v}}, width:"230px;",notRound:true}</widget>
                <img src="../../res/images/close_blue.png" w-class="close"/>
            </div>
            {{end}}
            {{if it.imgs.length < 9 }}
            <div w-class="upload" on-tap="upload"></div>
            {{end}}
        </div>
    </div>

    <div w-class="tools">
        <div>
            <img src="../../res/images/emoji.png" w-class="btn" on-tap="openEmoji"/>
            <img src="../../res/images/tool-camera.png" w-class="btn"/>
            <img src="../../res/images/tool-camera.png" w-class="btn"/>
        </div>

        <widget w-tag="chat-client-app-widget-emoji-emoji" w-class="emojiMap" id="emojiMap" style="display:{{it.isOnEmoji ? 'block' : 'none'}}"></widget>
    </div>
</div>