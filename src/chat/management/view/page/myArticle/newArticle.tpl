<div w-class="page">
    <div w-class="goBack" on-tap="goBack(false,e)">返回上一页</div>
    <div w-class="addBox">
        
        <div w-class="appName">标题</div>
        <div w-class="inputBox">
            <div w-class="input" ev-input-change="inputChangeName">
                <widget w-tag="chat-management-components-input">{itype:"text",placeHolder:"应用名称",input:{{it.title}},maxLength:10}</widget>
            </div>
            <div w-class="info">* 6-30字</div>
        </div>
    </div>

    <div w-class="addBox" style="height: 190px;">
        <div w-class="appName">banner</div>
        <div w-class="inputBox">
            {{if !it.bannerImg}}
                <div w-class="addIconBox" style="width:350px;height:150px;">
                    {{if !it.upLoadIng}}
                    <img src="../../../res/images/add_black.png" alt="" w-class="addIcon"/>
                    <input type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" w-class="inputFile" on-change="uploadImg(0,e)"/>
                    {{else}}
                        <div w-class="upload" style="background-image:url(../../../res/images/loading.gif)"></div>
                    {{end}}
                </div>
            {{else}}
                <div w-class="addIconBox" style="width:350px;height:150px;">
                    <img src="{{it.buildupImgPath(it.bannerImg)}}" alt="" w-class="upImg"/>
                    <img src="../../../res/images/remove.png" alt="" w-class="closeIcon" on-tap="clearImg(1)"/>
                </div>
            {{end}}
            <div w-class="info">* 单张图片不超过1M，最小尺寸600*260，建议尺寸800*350，大小200K以内，JPG、PNG格式</div>
        </div>
    </div>

    <div w-class="addBox" style="height: 452px;">
        <div w-class="appName">内容</div>
        <div w-class="contentBox">
            <div w-class="uploadImgBox">
                <div w-class="uploadImgTitle">
                    <img src="../../../res/images/addImg.png" alt="" w-class="addImg"/>
                    <div w-class="addImgDesc">插入图片</div>
                    <input type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" w-class="inputFile" on-change="uploadImg(1,e)"/>
                </div>
            </div>
            <div contenteditable="true" w-class="editBox" id="editBox" class="editor" on-input="editBoxChange" on-keydown="editorTap" on-paste="onpaste" ></div>
        </div>
    </div>

    <div w-class="btnGroup">
        <div w-class="btn1" on-tap="saveAsDraft
        ">保存到草稿</div>
        <div w-class="btn2" on-tap="send">提交审核</div>
    </div>
</div>
