<div style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
    <div><span>我的id是:{{it.sid}}</span></div>
    <div ev-input-text="inputUid">
        <span>请输入对方id</span>
        <pi-ui-input></pi-ui-input>
    </div>
    <div on-tap="applyFriend">点我申请添加对方为好友</div>
    <div>
    已有好友
    {{for key,value of it1.friends}}
        <div>{{value}}</div>
    {{end}}    
    </div>
    <div>
    别人申请加我为好友
    {{for key,value of it1.applyUser}}
        <div>{{value}}</div>
    {{end}}
    </div>
</div>