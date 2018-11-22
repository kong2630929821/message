{{: it1 = it1 || []}}
<div style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
    <div><span on-tap="openAddUser">!点我打开好友页面</span></div>
    这是最近的聊天界面
    {{for key,value of it1}}
        <div><client-app-demo_view-chat-lastMessageItem>{"rid":{{value[0]}} }</client-app-demo_view-chat-lastMessageItem> <span on-tap="chat({{value[0]}})">!点我聊天</span></div>
    {{end}}  
    
</div>