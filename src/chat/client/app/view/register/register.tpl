<div class="new-page" ev-back-click="back">
    <img src="../../res/images/home_bg.png" w-class="home_bg"/>
    <chat-client-app-widget1-topBar-topBar w-class="title">{title:"注册",background:"none"}</chat-client-app-widget1-topBar-topBar>
    <div w-class="avatar-wrap">
        <img w-class="avatar" src="../../res/images/user_avatar.png" />
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