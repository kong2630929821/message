<div style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
    这是聊天界面
    <div><span>我的id是:{{it.sid}}</span><br></br><span on-tap="subscribe">点我订阅自己的消息</span></div>
    <div><span>请输入对方uid</span><pi-ui-input ev-input-text="inputUid"></pi-ui-input></div>
    <div><span>请输入聊天</span><pi-ui-input ev-input-text="inputMessage"></pi-ui-input><span on-tap="send">点我发送</span></div>
</div>