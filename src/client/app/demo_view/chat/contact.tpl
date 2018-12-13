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
            {{for i,v of it1}}
            <widget w-tag="client-app-demo_view-chat-messageRecord" on-tap="chat({{v[0]}},'{{v[2]}}')" style="margin-bottom: 10px;">{"rid":{{v[0]}},"chatType":{{v[2]}} }</widget>
            {{end}} 
        </div> 
    </div>
    
    {{if it.isUtilVisible}}
    <div w-class="util-wrap" ev-handleFatherTap="handleFatherTap">
        <client-app-widget-utilList-utilList>{utilList:{{it.utilList}} }</client-app-widget-utilList-utilList>
    </div>
    {{end}}

</div>