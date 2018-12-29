{{: it1 = it1 || []}}
<div w-class="new-page" class="new-page" on-tap="closeMore">
    <div w-class="topBack" ev-next-click="getMore" ev-refresh-click="refreshPage">
        <img src="../../res/images/topbar_backimg.png" w-class="backImg"/>
        <widget w-tag="chat-client-app-widget-topBar-topBar1">{avatar:"",nextImg:"../../res/images/add-white.png" }</widget>
    </div>
    
    <div w-class="history-wrap">
        {{if it.netClose}}
        <div w-class="netClose">
            <img src="../../res/images/question_blue.png" style="width:48px;margin-right: 20px;"/>
            <span>网络连接不可用</span>
        </div>
        {{end}}

        <div w-class="inner-wrap" style="margin-top:{{it.netClose?'10px':'30px;'}}">
            {{for i,v of it1}}
            <div on-tap="chat({{v[0]}},'{{v[2]}}')" style="margin-bottom: 10px;" class="ripple">
                <widget w-tag="chat-client-app-demo_view-chat-messageRecord">{"rid":{{v[0]}},"chatType":{{v[2]}} }</widget>
            </div>
            {{end}} 
        </div> 
        {{if it1.length <= 0}}
        <div style="text-align: center;">
            <img src="../../res/images/chatEmpty.png" w-class="emptyImg"/>
            <div w-class="emptyText">快开始聊天吧~</div>
        </div>
        {{end}}
    </div>
    
    {{if it.isUtilVisible}}
    <div w-class="util-wrap" ev-handleFatherTap="handleFatherTap">
        <chat-client-app-widget-utilList-utilList>{utilList:{{it.utilList}} }</chat-client-app-widget-utilList-utilList>
    </div>
    {{end}}

</div>