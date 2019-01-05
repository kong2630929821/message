<div style="background:#fff;" class="new-page" ev-back-click="goChat">
    <chat-client-app-widget-topBar-topBar w-class="title">{title:"注册"}</chat-client-app-widget-topBar-topBar>
    <div w-class="success-status-wrap">
        <img src="../../res/images/icon_right2.png" w-class="successIcon"/>
        <span w-class="successText">注册成功</span>
    </div>
    <div w-class="id-wrap">
        <span w-class="other-text">您可以通过ID登录</span>
        <span w-class="id">{{it.uid}}</span>
    </div>
    <div w-class="goChat" on-tap="goChat">去聊天</div>
</div>