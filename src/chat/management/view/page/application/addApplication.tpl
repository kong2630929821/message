<div w-class="page">
    {{if it.status}}
        <div w-class="goBack" on-tap="goBack(false,e)" on-down="onShow">返回上一页</div>
    {{end}}
    <div w-class="addBox">
        <div w-class="appName">应用名称</div>
        <div w-class="inputBox">
            <div w-class="input" ev-input-change="inputChangeName">
                <widget w-tag="chat-management-components-input">{itype:"text",placeHolder:"应用名称",maxLength:10,input:{{it.name}},disabled:{{it.isChange?'':'true'}} }</widget>
            </div>
            <div w-class="info">* 最多10个字</div>
        </div>
    </div>

    <div w-class="addBox">
        <div w-class="appName">副标题</div>
        <div w-class="inputBox">
            <div w-class="input" ev-input-change="inputChangeSubTitle">
                <widget w-tag="chat-management-components-input">{itype:"text",placeHolder:"副标题",maxLength:15,input:{{it.subtitle}},disabled:{{it.isChange?'':'true'}} }</widget>
            </div>
            <div w-class="info">* 5-15个字</div>
        </div>
    </div>

    <div w-class="addBox" style="height:210px;">
        <div w-class="appName">应用简介</div>
        <div w-class="inputBox">
                <div w-class="newUserInput" ev-input-change="userChangeDesc">
                    <widget w-tag="chat-management-components-textarea">{placeHolder:"内容", style:"max-height:none;min-height:157px;font-size:16px;line-height:20px",maxLength:170,input:{{it.desc}},disabled:{{it.isChange?'':'true'}} }</widget>
                </div>
            <div w-class="info">* 最多170字</div>
        </div>
    </div>

    <div w-class="addBox">
        <div w-class="appName">游戏链接</div>
        <div w-class="inputBox">
            <div w-class="input" ev-input-change="changeGameSrc">
                <widget w-tag="chat-management-components-input">{itype:"text",placeHolder:"输入链接",input:{{it.appSrc}},disabled:{{it.isChange?'':'true'}} }</widget>
            </div>
        </div>
    </div>

    <div w-class="addBox">
        <div w-class="appName">应用唯一标识</div>
        <div w-class="inputBox">
            <div w-class="input" ev-input-change="changeWebViewName">
                <widget w-tag="chat-management-components-input">{itype:"text",placeHolder:"输入内容",input:{{it.webViewName}},disabled:{{it.isChange?'':'true'}} }</widget>
            </div>
            <div w-class="info">* 以英文字母开头，只能包含英文字母、数字、下划线</div>
        </div>
    </div>

    <div w-class="addBox">
        <div w-class="appName">appId</div>
        <div w-class="inputBox">
            <div w-class="input" ev-input-change="changeAppId">
                <widget w-tag="chat-management-components-input">{itype:"number",placeHolder:"输入内容",input:{{it.appId}},disabled:{{it.isChange?'':'true'}} }</widget>
            </div>
            <div w-class="info">* 不能重复，只能是数字</div>
        </div>
    </div>

    <div w-class="addBox" style="height: 137px;">
        <div w-class="appName">应用图标</div>
        <div w-class="inputBox">
            {{if !it.imgs.icon}}
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
                    <img src="{{it.buildupImgPath(it.imgs.icon)}}" alt="" w-class="upImg"/>
                    {{if it.isChange}}
                    <img src="../../../res/images/remove.png" alt="" w-class="closeIcon" on-tap="clearImg(0)"/>
                    {{end}}
                </div>
            {{end}}
            <div w-class="info">* 尺寸512*512，大小200K以内，JPG、PNG格式</div>
        </div>
    </div>
    
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
                    {{if it.isChange}}
                    <img src="../../../res/images/remove.png" alt="" w-class="closeIcon" on-tap="clearImg(1)"/>
                    {{end}}
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
                    {{if it.isChange}}
                    <img src="../../../res/images/remove.png" alt="" w-class="closeIcon" on-tap="clearImg(2)"/>
                    {{end}}
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
                    {{if it.isChange}}
                    <img src="../../../res/images/remove.png" alt="" w-class="closeIcon" on-tap="clearImg(3)"/>
                    {{end}}
                </div>
            {{end}}
            <div w-class="info">* 单张图片不超过1M，最小尺寸700*900，建议尺寸720*1280，大小200K以内，JPG、PNG格式</div>
        </div>
    </div>
    {{if 0==1}}
        <div w-class="addBox">
            <div w-class="appName">官方客服</div>
            <div w-class="inputBox">
                <div w-class="input" ev-input-change="inputChangeCustomer">
                    <widget w-tag="chat-management-components-input">{itype:"text",placeHolder:"官方客服",maxLength:10,input:{{it.customer}},disabled:{{it.isChange?'':'true'}} }</widget>
                </div>
            </div>
        </div>
    {{end}}
    <div w-class="addBox" style="align-items: center;margin-top:0;">
        <div w-class="appName">悬浮气泡位置</div>
        <div w-class="check" on-tap="checkBubbleType(true)">
            <img src="../../../res/images/{{it.checkBubble?'selectBox_active.png':'selectBox.png'}}" alt="" w-class="checkIcon"/>
            <div style="margin-left:20px;">可拖动</div>
        </div>
        <div w-class="check" style="margin-left:36px;" on-tap="checkBubbleType(false)">
            <img src="../../../res/images/{{it.checkBubble?'selectBox.png':'selectBox_active.png'}}" alt="" w-class="checkIcon"/>
            <div style="margin-left:20px;">固定右上角</div>
        </div>
    </div>

    <div w-class="addBox" style="align-items: center;margin-top:0;">
        <div w-class="appName">游戏屏幕</div>
        <div w-class="check" on-tap="checkScreenType(true)">
            <img src="../../../res/images/{{it.checkScreen?'selectBox_active.png':'selectBox.png'}}" alt="" w-class="checkIcon"/>
            <div style="margin-left:20px;">横屏游戏</div>
        </div>
        <div w-class="check" style="margin-left:36px;" on-tap="checkScreenType(false)">
            <img src="../../../res/images/{{it.checkScreen?'selectBox.png':'selectBox_active.png'}}" alt="" w-class="checkIcon"/>
            <div style="margin-left:20px;">竖屏游戏</div>
        </div>
    </div>

    <div w-class="btnGroup">
        {{if it.status}}
            {{if !it.isChange}}
                <div w-class="btn2" on-tap="changeApp">修改应用</div>
                <div w-class="btn1" style="margin-left:40px;" on-tap="delApp">删除应用</div>
            {{else}}
                <div w-class="btn1" on-tap="cancleChange">取消修改</div>
                <div w-class="btn2" on-tap="addApp">保存修改</div>
            {{end}}
        {{else}}
            <div w-class="btn2" on-tap="addApp">添加应用</div>
        {{end}}
    </div>
</div>
