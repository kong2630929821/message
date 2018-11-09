<div style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
    <client-app-widget-topBar-topBar>{title:{{it.rid}},background:"#fff"}</client-app-widget-topBar-topBar>
    {{if !it.isLogin}}
    <div w-class="unlogin-chat-wrap">
        <img w-class="no-message" src="../../res/images/no-message.png" />
        <span w-class="text">暂无信息</span>
    </div>
    {{end}}
    <div w-class="login-chat-wrap">
        单人聊天
    </div>
    <div ev-input-text="HandleOnInput" ev-send="send">
        <client-app-widget-inputMessage-inputMessage></client-app-widget-inputMessage-inputMessage>
    </div>
</div>
