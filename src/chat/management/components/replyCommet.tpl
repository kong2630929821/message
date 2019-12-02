<div w-class="confirmBox">
    <div w-class="body">
        <div>
            <span w-class ='title'>回复</span>
        </div>
        <div w-class="newUserInput">
            <div w-class="replyContent" ev-input-change="userChange" >
                <widget w-tag="chat-management-components-textarea">{placeHolder:"内容", style:"max-height:none;min-height:157px;font-size:16px;line-height:20px"}</widget>
            </div>
        <div w-class="uploadImgBox">
            <div w-class="uploadImgTitle">
                <img src="../../../res/images/addImg.png" alt="" w-class="addImg"/>
                <div w-class="addImgDesc">图片评论</div>
                <input type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" w-class="inputFile" on-change="uploadImg(1,e)"/>
            </div>
        </div>
        </div>
        <div w-class="btnGroup">
            <div w-class="btn" on-tap="btnCancel" on-down="onShow">取消</div>
            <div w-class="btn" on-tap="btnOk" on-down="onShow">确定</div>
        </div>
    </div>
</div>