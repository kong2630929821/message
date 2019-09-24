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
            <widget w-tag="chat-client-app-widget-input-textarea">{placeHolder:"标题1-24个字",input:{{it.titleInput}}, maxLength:24 }</widget>
        </div>
        <div style="position: relative;">
            <div contenteditable="{{it.isEditor}}" w-class="editBox" id="editBox" class="editor" on-input="editBoxChange" on-keydown="editorTap"></div>
            <div w-class="placeHolder">{{it.placeHolderInfo}}</div>
        </div>
        {{else}}
        <div w-class="content" ev-input-change="contentChange">
            <widget w-tag="chat-client-app-widget-input-textarea">{placeHolder:"内容", style:"max-height:none;min-height:300px;font-size:28px;", input:{{it.contentInput}},maxLength:{{it.isPublic ? 1000:400}} }</widget>
        </div>  
        {{end}}
        {{% ========================上传图片======================}}
        {{if !it.isPublic}}
        <div w-class="imageList">
            {{for i,v of it.uploadLoding}}
            {{if v}}
                <div w-class="upload" style="background-image:url(../../res/images/loading.gif)"></div>
            {{else}}
                <div w-class="imgBox">
                    <pi-ui-html style="display:inline-block;margin: 5px;">{{it.imgs[i]}}</pi-ui-html>
                    <img src="../../res/images/close_blue.png" w-class="close" on-tap="delImage({{i}})"/>
                </div>
            {{end}}
            
            {{end}}
            {{if it.uploadLoding.length < 1 }}
            <div w-class="upload" on-tap="chooseImage"></div>
            {{end}}
        </div>
        {{end}}
    </div>

    <div w-class="tools" ev-emoji-click="pickEmoji" >
        <div>
            <img src="{{it.emoji?'../../res/images/emoji.png':'../../res/images/emojiblue.png'}}" w-class="btn" on-tap="openEmoji"/>
            <img src="../../res/images/tool-pictures.png" w-class="btn" on-tap="chooseImage"/>
            <img src="{{it.camera?'../../res/images/tool-cameraGrey.png':'../../res/images/tool-camera.png'}}" w-class="btn" on-tap="openPhoto" on-tap="takePhoto"/>
        </div>

        <widget w-tag="chat-client-app-widget-emoji-emoji" w-class="emojiMap" id="emojiMap" style="display:{{it.isOnEmoji ? 'block' : 'none'}}">{isPublic:{{it.isPublic}}}</widget>
    </div>
</div>