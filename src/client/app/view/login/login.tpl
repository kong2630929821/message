<div style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
    <div>我是登录界面</div>
    <div ev-input-text="inputName">
        <span>输入用户id</span>
        <pi-ui-input></pi-ui-input>
    </div>
    <div ev-input-text="inputPasswd">
        <span>输入密码</span>
        <pi-ui-input></pi-ui-input>
    </div>
    <div on-tap="login">点我登录</div>
    <div on-tap="openRegister">点我注册</div>
</div>