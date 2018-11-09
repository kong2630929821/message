<div w-class="register-wrap" style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
    <client-app-widget-topBar-topBar w-class="title">{title:"注册",background:"none"}</client-app-widget-topBar-topBar>
    <div w-class="avator-wrap">
        <div w-class="user-avator">
            <img w-class="avator" src="../../res/images/user.png" />
        </div>
        <span w-class="upload" on-tap="upload">上传头像</span>
    </div>
    <div w-class="input-wrap">
        <client-app-widget-randomName-randomName></client-app-widget-randomName-randomName>
        <client-app-widget-newPassword-newPassword>{tips:"至少8位字符，并包含英文、数字、特殊字符其中两种类型"}</client-app-widget-newPassword-newPassword> 
    </div>
    <span w-class="register-btn" on-tap="register">注册</span>
</div>