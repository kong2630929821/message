<div class="new-page" w-class="page">
    <app-publicComponents-blankDiv-topDiv></app-publicComponents-blankDiv-topDiv>
    <div w-class="topBar">
        <div w-class="topBarItem" on-tap="close">取消</div>
        <div w-class="topBarItem">{{it.title}}</div>
        <div w-class="topBarItem" style="color:{{it.contentInput||it.saveImgs.length?'#4285F4':'#EEE'}}" on-tap="send">发布</div>
    </div>
    <div w-class="contain">
        {{if it.isPublic}}
        <div w-class="title" ev-input-change="titleChange">
            <widget w-tag="chat-client-app-widget1-input-textarea">{placeHolder:"标题1-24个字",input:{{it.titleInput}}, maxLength:24 }</widget>
        </div>
        <div style="position: relative;">
            <div contenteditable="true" w-class="editBox" id="editBox" class="editor" on-input="editBoxChange" on-keydown="editorTap" on-paste="onpaste" ></div>
        </div>
        {{else}}
        <div w-class="content" ev-input-change="contentChange" ev-input-focus="inputClick">
            <widget w-tag="chat-client-app-widget1-input-textarea">{placeHolder:"内容", style:"max-height:none;min-height:300px;font-size:28px;", input:{{it.contentInput}},maxLength:{{it.isPublic ? 1000:400}} }</widget>
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
                    <img src="../../res/images/remove.png" w-class="close" on-tap="delImage({{i}})"/>
                </div>
            {{end}}
            
            {{end}}
            {{if it.uploadLoding.length < 9 }}
            <div w-class="upload" on-tap="chooseImage"></div>
            {{end}}
        </div>
        {{end}}

        {{if !it.label.name}}
            <div w-class="postLabel" style="width:161px;" on-tap="addLabel">
                <img src="../../res/images/add_white.png" alt="" w-class="addLabel"/>
                <div style="margin-right: 5px;">游戏标签</div>
            </div>
        {{else}}
            <div w-class="postLabel" style="width:200px;" on-tap="addLabel">
                <img src="{{it.buildupImgPath(it.label.icon)}}" alt="" w-class="addLabel"/>
                <div w-class="labelName">{{it.label.name}}</div>
                <img src="../../res/images/unLabel.png" alt="" w-class="closeLabel" on-tap="closeLabel"/>
            </div>
        {{end}}
        
      
    </div>


    <div w-class="tools" ev-emoji-click="pickEmoji" >
        <div>
            <img src="{{it.showType[0]?'../../res/images/emoji.png':'../../res/images/emojiblue.png'}}" w-class="btn" on-tap="openEmoji"/>
            <img src="{{it.showType[1]?'../../res/images/tool-pictures.png':'../../res/images/tool-picturesBlue.png'}}" w-class="btn" on-tap="chooseImage"/>
            <img src="{{it.showType[2]?'../../res/images/tool-cameraGrey.png':'../../res/images/tool-camera.png'}}" w-class="btn" on-tap="takePhoto"/>
        </div>

        <widget w-tag="chat-client-app-widget1-emoji-emoji" w-class="emojiMap" id="emojiMap" style="display:{{it.isOnEmoji ? 'block' : 'none'}}">{isPublic:{{it.isPublic}}}</widget>
    </div>
</div>