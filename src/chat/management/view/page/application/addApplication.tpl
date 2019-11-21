<div w-class="page">
    {{if it.status}}
    {{%================================修改应用==========================================}}
    <div w-class="changeAppInfo">
        <div w-class="iconBox">
            <div>
                {{if !it.icon}}
                    <div w-class="addIconBox" style="width:120px;height:120px;">
                        {{if !it.upLoadIng[0]}}
                            <img src="../../../res/images/add_black.png" alt="" w-class="addIcon"/>
                            <input type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" w-class="inputFile" on-change="uploadImg(0,e)"/>
                        {{else}}
                            <div w-class="upload" style="background-image:url(../../../res/images/loading.gif)"></div>
                        {{end}}
                    </div>
                {{else}}
                    <div w-class="addIconBox" style="width:120px;height:120px;">
                        <img src="{{it.buildupImgPath(it.icon)}}" alt="" w-class="upImg"/>
                        <img src="../../../res/images/remove.png" alt="" w-class="closeIcon" on-tap="clearImg(0)"/>
                    </div>
                {{end}}
            </div>
            <div w-class="changeAppNameBox">
                <div w-class="input" ev-input-change="inputChangeName">
                    <widget w-tag="chat-management-components-input">{itype:"text",placeHolder:"应用名称",maxLength:10}</widget>
                </div>
                <div w-class="input" ev-input-change="inputChangeName">
                    <widget w-tag="chat-management-components-input">{itype:"text",placeHolder:"应用名称",maxLength:10}</widget>
                </div>
                <div w-class="input" ev-input-change="inputChangeName">
                    <widget w-tag="chat-management-components-input">{itype:"text",placeHolder:"应用名称",maxLength:10}</widget>
                </div>
            </div>
        </div>
        <div w-class="iconBoxRight">
            <div w-class="appId">应用ID：1222222</div>
            <div w-class="createAddTime">添加时间：2019-12-12</div>
            <div w-class="btnGroup">
                <div w-class="btn1">取消修改</div>
                <div w-class="btn2">保存修改</div>
                <div w-class="btn1">删除应用</div>
            </div>
        </div>
    </div>

    {{else}}

    {{%===============================================添加应用=========================================}}
    <div w-class="addBox">
        <div w-class="appName">应用名称</div>
        <div w-class="inputBox">
            <div w-class="input" ev-input-change="inputChangeName">
                <widget w-tag="chat-management-components-input">{itype:"text",placeHolder:"应用名称",maxLength:10}</widget>
            </div>
            <div w-class="info">* 最多10个字</div>
        </div>
    </div>

    <div w-class="addBox">
        <div w-class="appName">副标题</div>
        <div w-class="inputBox">
            <div w-class="input" ev-input-change="inputChangeSubTitle">
                <widget w-tag="chat-management-components-input">{itype:"text",placeHolder:"副标题",maxLength:15}</widget>
            </div>
            <div w-class="info">* 5-15个字</div>
        </div>
    </div>
    {{end}}

    {{%===============================================添加应用=========================================}}
    <div w-class="addBox" style="height:210px;">
        <div w-class="appName">应用简介</div>
        <div w-class="inputBox">
                <div w-class="newUserInput" ev-input-change="userChangeDesc">
                    <widget w-tag="chat-management-components-textarea">{placeHolder:"内容", style:"max-height:none;min-height:157px;font-size:16px;line-height:20px",maxLength:170 }</widget>
                </div>
            <div w-class="info">* 5-15个字</div>
        </div>
    </div>

    {{if !it.status}}
    <div w-class="addBox" style="height: 137px;">
        <div w-class="appName">应用图标</div>
        <div w-class="inputBox">
            {{if !it.icon}}
                <div w-class="addIconBox">
                    {{if !it.upLoadIng[0]}}
                        <img src="../../../res/images/add_black.png" alt="" w-class="addIcon"/>
                        <input type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" w-class="inputFile" on-change="uploadImg(0,e)"/>
                    {{else}}
                        <div w-class="upload" style="background-image:url(../../../res/images/loading.gif)"></div>
                    {{end}}
                </div>
            {{else}}
                <div w-class="addIconBox">
                    <img src="{{it.buildupImgPath(it.icon)}}" alt="" w-class="upImg"/>
                    <img src="../../../res/images/remove.png" alt="" w-class="closeIcon" on-tap="clearImg(0)"/>
                </div>
            {{end}}
            <div w-class="info">* 尺寸512*512，大小200K以内，JPG、PNG格式</div>
        </div>
    </div>
    {{end}}
    
    <div w-class="addBox" style="height: 190px;">
        <div w-class="appName">横版宣传图</div>
        <div w-class="inputBox">
            {{if !it.imgs.rowImg}}
                <div w-class="addIconBox" style="width:350px;height:150px;">
                    {{if !it.upLoadIng[1]}}
                    <img src="../../../res/images/add_black.png" alt="" w-class="addIcon"/>
                    <input type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" w-class="inputFile" on-change="uploadImg(1,e)"/>
                    {{else}}
                        <div w-class="upload" style="background-image:url(../../../res/images/loading.gif)"></div>
                    {{end}}
                </div>
            {{else}}
                <div w-class="addIconBox" style="width:350px;height:150px;">
                    <img src="{{it.buildupImgPath(it.imgs.rowImg)}}" alt="" w-class="upImg"/>
                    <img src="../../../res/images/remove.png" alt="" w-class="closeIcon" on-tap="clearImg(1)"/>
                </div>
            {{end}}
            <div w-class="info">* 单张图片不超过1M，最小尺寸700*300，建议尺寸800*350，大小200K以内，JPG、PNG格式</div>
        </div>
    </div>

    <div w-class="addBox" style="height: 190px;">
        <div w-class="appName">主推宣传图</div>
        <div w-class="inputBox">
            {{if !it.imgs.colImg}}
                <div w-class="addIconBox" style="width:120px;height:154px;">
                    {{if !it.upLoadIng[2]}}
                        <img src="../../../res/images/add_black.png" alt="" w-class="addIcon"/>
                        <input type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" w-class="inputFile" on-change="uploadImg(2,e)"/>
                    {{else}}
                        <div w-class="upload" style="background-image:url(../../../res/images/loading.gif)"></div>
                    {{end}}
                </div>
            {{else}}
                <div w-class="addIconBox" style="width:120px;height:154px;">
                    <img src="{{it.buildupImgPath(it.imgs.colImg)}}" alt="" w-class="upImg"/>
                    <img src="../../../res/images/remove.png" alt="" w-class="closeIcon" on-tap="clearImg(2)"/>
                </div>
            {{end}}
            <div w-class="info">* 单张图片不超过1M，最小尺寸700*800，建议尺寸720*900，大小200K以内，JPG、PNG格式</div>
        </div>
    </div>

    <div w-class="addBox" style="height: 190px;">
        <div w-class="appName">下载背景图</div>
        <div w-class="inputBox">
            {{if !it.imgs.downLoadImg}}
                <div w-class="addIconBox" style="width:100px;height:154px;">
                    {{if !it.upLoadIng[3]}}
                        <img src="../../../res/images/add_black.png" alt="" w-class="addIcon"/>
                        <input type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" w-class="inputFile" on-change="uploadImg(3,e)"/>
                    {{else}}
                        <div w-class="upload" style="background-image:url(../../../res/images/loading.gif)"></div>
                    {{end}}
                </div>
            {{else}}
                <div w-class="addIconBox" style="width:100px;height:154px;">
                    <img src="{{it.buildupImgPath(it.imgs.downLoadImg)}}" alt="" w-class="upImg"/>
                    <img src="../../../res/images/remove.png" alt="" w-class="closeIcon" on-tap="clearImg(3)"/>
                </div>
            {{end}}
            <div w-class="info">* 单张图片不超过1M，最小尺寸700*900，建议尺寸720*1280，大小200K以内，JPG、PNG格式</div>
        </div>
    </div>

    {{if !it.status}}
    <div w-class="addBox" style="height: 150px;margin-bottom: 100px;">
        <div w-class="appName">官方客服</div>
        <div w-class="inputBox">
            <div w-class="input" ev-input-change="inputChangeCustomer">
                <widget w-tag="chat-management-components-input">{itype:"text",placeHolder:"官方客服",maxLength:10}</widget>
            </div>
            <div w-class="btn" on-tap="addApp" on-down="onShow">添加游戏</div>
        </div>
    </div>
    {{end}}
</div>
