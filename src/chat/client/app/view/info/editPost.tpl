<div class="new-page" w-class="page">
    <app-components1-blankDiv-topDiv></app-components1-blankDiv-topDiv>
    <div w-class="topBar">
        <div w-class="topBarItem" on-tap="close">取消</div>
        <div w-class="topBarItem">{{it.title}}</div>
        <div w-class="topBarItem" style="color:#888888" on-tap="send">发布</div>
    </div>
    <div w-class="contain">
        {{if it.isPublic}}
        <div w-class="title" ev-input-change="titleChange">
            <widget w-tag="chat-client-app-widget-input-input">{placeHolder:"标题1-24个字",input:{{it.titleInput}}, maxLength:24 }</widget>
        </div>
        {{end}}
        <div class="container">
            <div class="hero-unit"> 
            <div id="editor">Go ！！！ </div>
            <div class="btn-toolbar" data-role="editor-toolbar" data-target="#editor">
            <div class="btn-group">
                <a class="btn" title="Insert picture (or just drag & drop)" id="pictureBtn"><i class="icon-picture"></i></a>
                <input type="file" data-role="magic-overlay" data-target="#pictureBtn" data-edit="insertImage" />
            </div>
        
            <input type="text" data-edit="inserttext" id="voiceBtn" x-webkit-speech="">
            </div>
        </div>
        
        {{% ========================上传图片======================}}
        <div w-class="imageList">
            {{for i,v of it.imgs}}
            <div w-class="imgBox">
                <pi-ui-html style="display:inline-block;margin: 5px;">{{v}}</pi-ui-html>
                <img src="../../res/images/close_blue.png" w-class="close" on-tap="delImage({{i}})"/>
            </div>
            {{end}}
            {{if it.imgs.length < 9 }}
            <div w-class="upload" on-tap="chooseImage"></div>
            {{end}}
        </div>
    </div>

    <div w-class="tools" ev-emoji-click="pickEmoji" >
        <div>
            <img src="../../res/images/emoji.png" w-class="btn" on-tap="openEmoji"/>
            <img src="../../res/images/tool-camera.png" w-class="btn" on-tap="takePhoto"/>
        </div>

        <widget w-tag="chat-client-app-widget-emoji-emoji" w-class="emojiMap" id="emojiMap" style="display:{{it.isOnEmoji ? 'block' : 'none'}}"></widget>
    </div>
</div>