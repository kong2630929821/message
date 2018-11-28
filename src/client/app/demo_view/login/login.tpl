<div w-class="login-wrap" style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
    <client-app-widget-topBar-topBar w-class="title">{title:"登录聊天",background:"none"}</client-app-widget-topBar-topBar>
    <div w-class="logo-wrap">
        <img w-class="logo" src="../../res/images/logo.png" />
    </div>
    <div w-class="input-wrap">
        <div ev-input-change="inputName">
            <client-app-widget-input-input w-class="pi-input idInput">{placeHolder : "ID",style : "font-size:32px;color:#318DE6"}</client-app-widget-input-input>
        </div>
        <div ev-input-change="inputPasswd">
            <client-app-widget-input-input w-class="pi-input">{placeHolder : "密码",itype :{{it.visible ? "text" : "password"}},clearable : true,style : "font-size:32px;color:#318DE6" }</client-app-widget-input-input>
        </div>
    </div>
    <div w-class="eye" on-tap="changeEye">
        <img src="../../res/images/{{it.visible ? 'open' : 'close'}}Eyes.png" />
    </div>
    
    <span w-class="login-btn" on-tap="login">登录</span>
    <span w-class="bottom-tip" on-tap="openRegister">没有账号？注册</span>
</div>