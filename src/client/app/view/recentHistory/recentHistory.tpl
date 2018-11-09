<div w-class="recent-history-wrap" style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
    <div w-class="outer" style="background: black">
        <div w-class="ga-top-banner" >
            <div w-class="left-container">
                <img on-tap="tomyHome" src="../../res/images/user.png" w-class="avator" />
            </div>
            <img on-tap="getMore" src="../../res/images/add-white.png" w-class="get-more" />
            <img on-tap="refreshPage" src="../../res/images/refresh-white.png" w-class="refreshBtn"/>
        </div>
    </div>
    <div w-class="history-wrap">
        <div w-class="inner-wrap">
            {{for index,item of it.messageList}}
            <client-app-widget-messageRecord-messageRecord style="margin-bottom:10px;">{{item}}</client-app-widget-messageRecord-messageRecord>
            {{end}} 
            <div>这是最近历史对话列表记录页面</div>
            <div>我的id是{{it.uid}}</div>
            <div on-tap="openAddUser">点我进入添加好友界面</div>  
        </div> 
    </div>
    {{if it.isUtilVisible}}
    <div w-class="util-wrap" ev-handleFatherTap="handleFatherTap">
        <client-app-widget-utilList-utilList>{utilList:{{it.utilList}} }</client-app-widget-utilList-utilList>
    </div>
    {{end}}
</div>