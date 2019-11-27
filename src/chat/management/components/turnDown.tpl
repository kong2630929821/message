<div w-class="turnDownBox">
    <div w-class="body">
        <div w-class="title">驳回认证申请</div>
        <div w-class="input" ev-input-change="inputChange">
            <widget w-tag="chat-management-components-textarea">{placeHolder:"填写原因", style:"max-height:none;min-height:60px;font-size:16px;line-height:20px", input:{{it.input}} }</widget>
        </div>
        <div style="width:400px;margin-top:20px;">客服回复：</div>
        <div style="width:400px;margin-top:10px;">您的官方认证因“{{it.input}}”被驳回</div>
        <div w-class="btnGroup">
            <div w-class="btn" on-tap="btnCancel" on-down="onShow">{{it.btn1}}</div>
            <div w-class="btn" on-tap="btnOk" on-down="onShow">{{it.btn2}}</div>
        </div>
    </div>
</div>