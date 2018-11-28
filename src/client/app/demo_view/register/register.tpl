<div w-class="register-wrap" class="new-page" ev-back-click="back">
    <client-app-widget-topBar-topBar w-class="title">{title:"注册",background:"none"}</client-app-widget-topBar-topBar>
    <div w-class="avator-wrap">
        <img w-class="avator" src="../../res/images/user.png" />
        <span w-class="upload" on-tap="upload">上传头像</span>
    </div>
    <div w-class="input-wrap" ev-psw-change="inputPasswd">
        <div style="border-bottom: 1px solid #DBDBE5;" ev-rName-change="inputName" >
            <client-app-widget-randomName-randomName></client-app-widget-randomName-randomName>
        </div>
        <client-app-widget-newPassword-newPassword>{}</client-app-widget-newPassword-newPassword> 
    </div>
    <span w-class="register-btn" on-tap="register">注册</span>
</div>