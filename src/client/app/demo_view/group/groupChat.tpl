{{let len = it.aIncIdArray ? it.aIncIdArray.length : 0}}
<div style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
    <div ev-back-click="goBack">
        <client-app-widget-topBar-topBar>{title:{{it.groupName}},background:"#fff",nextImg:"more-dot-white.png"}</client-app-widget-topBar-topBar>
    </div>
    {{if !it.isLogin}}
    <div w-class="unlogin-chat-wrap">
        <img w-class="no-message" src="../../res/images/no-message.png" />
        <span w-class="text">暂无信息</span>
    </div>
    {{end}}
    <div w-class="login-chat-wrap" ev-send="send">
        <div w-class="inner">
        {{for key,value of it.hidIncArray}}
            <client-app-widget-messageItem-messageItem>{"hIncId": {{value}}, "chatType":"group" }</client-app-widget-messageItem-messageItem>
        {{end}}
        <div id="messEnd"></div>
        </div> 
    </div>
    {{if len > 0}}
    <div ev-send="send" style="width:100%;height:128px;position:absolute;top:129px;left:0px;">
        <client-app-demo_view-group-latestAnnItem>{aIncId:{{it.aIncIdArray[len - 1]}}, gid:{{it.gid}} }</client-app-demo_view-group-latestAnnItem>
    </div>
    {{end}}
    <div ev-send="send">
        <client-app-widget-inputMessage-inputMessage></client-app-widget-inputMessage-inputMessage>
    </div>
</div>
