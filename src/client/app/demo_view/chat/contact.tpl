{{: it1 = it1 || []}}
<div w-class="new-page" class="new-page" on-tap="closeMore">
    <div w-class="outer">
        <div w-class="ga-top-banner" >
            <div w-class="left-container">
                <img on-tap="tomyHome" src="../../res/images/user.png" w-class="avator" />
            </div>
            <img on-tap="getMore" src="../../res/images/add-blue.png" w-class="get-more" />
            <img on-tap="refreshPage" src="../../res/images/refresh_blue.png" w-class="refreshBtn"/>
        </div>
    </div>
    <div w-class="history-wrap">
        <div w-class="inner-wrap">
            {{for index,item of it.messageList}}
            <client-app-widget-messageRecord-messageRecord style="margin-bottom:10px;">{{item}}</client-app-widget-messageRecord-messageRecord>
            {{end}} 
             
        </div> 
    </div>
    
    {{if it.isUtilVisible}}
    <div w-class="util-wrap" ev-handleFatherTap="handleFatherTap">
        <client-app-widget-utilList-utilList>{utilList:{{it.utilList}} }</client-app-widget-utilList-utilList>
    </div>
    {{end}}

    {{for key,value of it1}}
        <div><client-app-demo_view-chat-lastMessageItem>{"rid":{{value[0]}} }</client-app-demo_view-chat-lastMessageItem> <span on-tap="chat({{value[0]}})">!点我聊天</span></div>
    {{end}} 
</div>