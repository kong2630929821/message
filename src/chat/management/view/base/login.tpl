<div w-class="page">
    <div w-class="content">
        <img src="../../res/images/logo.png" w-class="img"/>
        <div w-class="title">好嗨管理后台</div>
        <div ev-input-change="nameChange" w-class="input">
            <img src="../../res/images/account.png"/>
            <widget w-tag="chat-management-components-input" style="flex:1 0 0;">{placeHolder:"账号",style:"padding-left:20px"}</widget>
        </div>
        <div ev-input-change="pwdChange" w-class="input" ev-input-keydown="keydown">
            <img src="../../res/images/password.png"/>
            <widget w-tag="chat-management-components-input" style="flex:1 0 0;">{placeHolder:"密码",style:"padding-left:20px",itype:"password"}</widget>
        </div>
        <div w-class="btn" on-tap="loginUser" on-down="onShow">登录</div>
    </div>
</div>