<div style="position: absolute; width:100%;height:100%;overflow:hidden" > 
    <span style="font-size:36px;width:100%;" on-tap="back">点我返回</span>
    <span style="font-size:36px;width:100%;border:1px" on-tap="createGroup">点我创建群</span>
    <div ev-input-change="inputName">
        <chat-client-app-widget-input-input >{placeHolder : "输入群组名称",style : "font-size:32px;color:#ccc;padding-left:82px;border-radius: 12px;"}</chat-client-app-widget-input-input>
    </div>

    <div>
        {{for i,v of it1.friends}}
        <div on-tap="addMember({{v}})" style="border-bottom: 1px solid #DBDBE5;">
            <chat-client-app-widget-contactItem-contactItem>{"uid":{{v}} }</chat-client-app-widget-contactItem-contactItem>
        </div>
        {{end}}
    </div>
</div>