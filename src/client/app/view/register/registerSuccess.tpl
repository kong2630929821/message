<div w-class="register-success-wrap" style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
    <client-app-widget-topBar-topBar w-class="title">{title:"注册",background:"#fff"}</client-app-widget-topBar-topBar>
    <div w-class="success-status-wrap">
        <img src="../../res/images/icon_right2.png" w-class="successIcon">
        <span w-class="successText">注册成功</span>
    </div>
    <div w-class="id-wrap">
        <span w-class="other-text">您可以通过ID登录</span>
        <span w-class="id">{{it.uid}}</span>
    </div>
    <div w-class="goChat" on-tap="goChat">去聊天</div>
</div>