<div class="new-page" ev-back-click="cancelBtnClick" w-class="new-page" ev-send="send" ev-next-click="groupDetail" on-tap="close">
    <chat-client-app-widget-topBar-topBar>{title:"举报",nextImg:"" }</chat-client-app-widget-topBar-topBar>
    <div w-class="modal-mask">
        <div w-class="report-violations">投诉 @ {{it.title}}</div>
        <div w-class="userInfo">
            <widget w-tag="chat-client-app-widget-imgShow-imgShow" w-class="avatar" >{imgURL:{{it.avatar}},width:"150px;"}</widget>
            <div w-class="content">
            <div w-class="user">
                    <div w-class="userName">@ {{it.title}}</div>
                    {{if it.sex!=2}}
                    <img src="{{it.sex==0?'../../res/images/boy.png':'../../res/images/girl.png'}}" alt="" w-class="sexImg"/>
                    {{end}}
                </div>
                <div w-class="contentBox">{{it.msg}}</div>
            </div>
        </div>
        <div w-class="reportType">请选择你要投诉的类型：</div>
        <div w-class="checkType">
            {{for i,v of it.content}}
                <div w-class="{{it.selectStaus[i]?'active':'item'}}" on-tap="doClick({{i}})" on-down="onShow">{{v}}</div>
            {{end}}
        </div>
        {{% ========================上传图片======================}}
        {{if it.status==1 || it.status==2}}
        <div w-class="imageList">
            {{for i,v of it.imgs}}
            <div w-class="imgBox">
                <pi-ui-html style="display:inline-block;margin: 5px;">{{v}}</pi-ui-html>
                <img src="../../res/images/close_blue.png" w-class="close" on-tap="delImage({{i}})"/>
            </div>
            {{end}}
            {{if it.imgs.length < 3 }}
            <div w-class="upload" on-tap="chooseImage"></div>
            {{end}}
        </div>
        <div w-class="reportType">补充描述（140字内）：</div>
        <div w-class="content1" ev-input-change="contentChange">
            <widget w-tag="chat-client-app-widget-input-textarea">{placeHolder:{{it.placeholder}}, style:"max-height:229px;height:156px;font-size:28px;", input:{{it.contentInput}},maxLength:140 }</widget>
        </div>
        {{end}}
        <div w-class="btn" on-down="onShow" on-tap="okBtnClick">提交</div>
    </div>
</div>

