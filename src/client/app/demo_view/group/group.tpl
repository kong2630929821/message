{{: it1 = it1 || {"group":[], "applyGroup":[]} }}
<div style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
    <div on-tap="returnFunc">!点我返回</div>
    <div><span>我的id是:{{it.sid}}</span></div>
    <div ev-input-text="inputUid">
        <span>请输入对方群组id</span>
        <pi-ui-input></pi-ui-input>
    </div>
    <div on-tap="applyFriend">!点我申请加入群组</div>
    <div>
    已有群组
    <br></br>
    {{for key,value of it1.group}}
        <div>
            <span>id:{{value}}</span>
            <span on-tap="chat({{value}})">!点我聊天</span>
            <span on-tap="delFriend({{value}})">!点我删除</span>
            <span on-tap="showInfo({{value}})">!点我查看详情</span>
        </div>
    {{end}}  
    <br></br>  
    </div>
    <div>
    别人邀请我加入群组
    <br></br>
    {{for key,value of it1.applyGroup}}
        <div><span>id:{{value}}</span><span on-tap="agree({{value}})">!点我同意</span><span on-tap="reject({{value}})">!点我拒绝</span></div>
    {{end}}
    <br></br>
    </div>
</div>