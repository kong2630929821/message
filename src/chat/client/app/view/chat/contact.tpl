{{: it1 = it1 || {lastChat:[],contactMap:""} }}
<div w-class="new-page" class="new-page" on-tap="closeMore">
    {{if it.hasWallet}}
        <div w-class="topBack" ev-next-click="getMore" ev-refresh-click="refreshPage">
            <div w-class="backImg"></div>
            {{if it1.contactMap && (it1.contactMap.applyUser.length + it1.contactMap.applyGroup.length) > 0}}
            <span w-class="redSpot" ></span>
            {{end}}
            <widget w-tag="chat-client-app-widget-topBar-topBar1">{avatar:"{{it.avatar}}", nextImg:"../../res/images/add-white.png" }</widget>
        </div>
        
        <div w-class="history-wrap">
           
            {{if !it.isLogin}}
            <div w-class="netClose" style="font-size:28px;color:rgba(34,34,34,1);line-height:48px;display: flex;align-items: center;padding: 20px 30px;background: #E9F9FF;height: 88px;">
                <img src="../../res/images/question_blue.png" style="width:32px;margin-right: 10px;"/>
                <span style="margin-right:20px;">网络连接不可用&nbsp;<span style="color:#388EFF;" on-tap="reConnect">点击重连</span></span>
                {{if it.reconnecting}}
                <app-components1-loading-loading2>{}</app-components1-loading-loading2>
                {{end}}
            </div>
            {{end}}
            
            {{if it1.lastChat && it1.lastChat.length == 0}}
            <div style="text-align: center;">
                <img src="../../res/images/chatEmpty.png" w-class="emptyImg"/>
                <div w-class="emptyText">快开始聊天吧~</div>
            </div>
            {{elseif it1.lastChat}}
            <div w-class="inner-wrap" style="margin-top:{{it.netClose?'10px':'30px;'}}">
                {{for i,v of it1.lastChat}}
                <div on-tap="chat(e,{{v[0]}},'{{v[2]}}')" style="margin-bottom: 10px;">
                    <widget w-tag="chat-client-app-view-chat-messageRecord">{rid:{{v[0]}},time:{{v[1]}},chatType:{{v[2]}} }</widget>
                </div>
                {{end}} 
            </div>
            {{end}}
        </div>
        
        {{if it.isUtilVisible}}
        <div w-class="util-wrap" ev-handleFatherTap="handleFatherTap">
            <chat-client-app-widget-utilList-utilList>{utilList:{{it.utilList}} }</chat-client-app-widget-utilList-utilList>
            {{if it1.contactMap && (it1.contactMap.applyUser.length + it1.contactMap.applyGroup.length) > 0}}
            <span w-class="redSpot" style="right: 145px;top:20px;"></span>
            {{end}}
        </div>
        {{end}}
        
    {{else}}
        <app-view-chat-home-home></app-view-chat-home-home>
    {{end}}
</div>