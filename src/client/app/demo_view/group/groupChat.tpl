<div style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
    <div ev-back-click="goBack">
        <client-app-widget-topBar-topBar>{title:{{it.gid}},background:"#fff",nextImg:"more-dot-white.png"}</client-app-widget-topBar-topBar>
    </div>
    {{if !it.isLogin}}
    <div w-class="unlogin-chat-wrap">
        <img w-class="no-message" src="../../res/images/no-message.png" />
        <span w-class="text">暂无信息</span>
    </div>
    {{end}}
    <div w-class="login-chat-wrap">
        群组聊天
    </div>
    <div ev-send="send">
        <client-app-widget-inputMessage-inputMessage>{"rid":10001}</client-app-widget-inputMessage-inputMessage>
    </div>
</div>
