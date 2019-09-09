<div class="new-page" w-class="page" ev-back-click="goBack" ev-next-click="showUtils" on-tap="closeUtils">
    <widget w-tag="chat-client-app-widget-topBar-topBar">{title:"",background:"#fff",nextImg:"more-dot-blue.png"}</widget>
    <div w-class="openPublicBox">
        <div w-class="avatar" on-tap="uploadAvatar" on-down="onShow">
            {{if !it.chooseImage}}
                <widget w-tag="app-components1-img-img" on-tap="uploadAvatar">{imgURL:{{it.avatar}},width:"80px;"}</widget>
            {{else}}
                <widget w-tag="pi-ui-html" on-tap="uploadAvatar" w-class="ui-html">{{it.avatarHtml}}</widget>
            {{end}}
        </div>
        <div w-class="bindPhone">
            <div w-class="phone">手机号码</div>
            <div w-class="bindStatus">
                <div w-class="status">未绑定</div>
                <img src="../../res/images/more-gray.png" alt="" w-class="more"/>
            </div>
        </div>
        <div w-class="pubInfo">嗨嗨号资料</div>
        <div w-class="name-box" ev-input-change="publicNameChange">
            <widget w-tag="app-components1-input-input" style="flex: 1;">{input:{{it.publicName}},maxLength:12,placeHolder:"名称"}</widget> 
        </div>
        <div w-class="infoArea">
            <widget w-tag="chat-client-app-widget-input-textarea">{placeHolder:"描述嗨嗨号", style:"max-height:none;min-height:300px;font-size:28px;", input:{{it.contentInput}},maxLength:140 }</widget>
        </div>
        <div w-class="await">12-24小时内反馈申请进度</div>
        <div ev-btn-tap="createClick" w-class="btn">
            <app-components1-btn-btn>{"name":"发送开通申请","types":"big","color":"blue","cannotClick":{{!it.userProtocolReaded}} }</app-components1-btn-btn>
        </div>
    </div>
    
</div>