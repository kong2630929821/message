<div style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
    <div on-tap="back">!点我返回</div>
    这是聊天界面
    <div><span>我的uid:{{it.sid}}</span></div>
    <div><span>对方uid:{{it.rid}}</span></div>
    {{for key,value of it.hidIncArray}}
        <client-app-demo_view-chat-chatItem>{"hIncId": {{value}} }</client-app-demo_view-chat-chatItem>
    {{end}}  
    <div><span>请输入聊天</span><pi-ui-input ev-input-text="inputMessage"></pi-ui-input><span on-tap="send">!点我发送</span></div>
    <div><span on-tap="openAddUser">!点我打开好友页面</span></div>
</div>