<div style="background: url('../../chat/client/app/res/images/home_bg.png');" class="new-page" ev-back-click="back">
    <chat-client-app-widget-topBar-topBar w-class="title">{title:"注册",background:"none"}</chat-client-app-widget-topBar-topBar>
    <div w-class="avator-wrap">
        <img w-class="avator" src="../../res/images/user.png" />
        <span w-class="upload" on-tap="upload">上传头像</span>
    </div>
    <div w-class="input-wrap" ev-psw-change="inputPasswd">
        <div style="border-bottom: 1px solid #DBDBE5;" ev-rName-change="inputName" >
            <chat-client-app-widget-randomName-randomName>{"name":{{it.name}} }</chat-client-app-widget-randomName-randomName>
        </div>
        <chat-client-app-widget-newPassword-newPassword>{}</chat-client-app-widget-newPassword-newPassword> 
    </div>
    <span w-class="register-btn" on-tap="register">注册</span>
</div>