<div class="new-page" w-class="page" ev-back-click="goBack">
    <chat-client-app-widget-topBar-topBar>{title:"管理关注",background:"#fff"}</chat-client-app-widget-topBar-topBar>
    <div w-class="input">
        <widget w-tag="chat-client-app-widget-input-input">{placeHolder:"搜索",style:"border-radius:34px;background:#F9F9F9;font-size:28px;padding-left:65px"}</widget>
        <img w-class="searchIcon" src="../../res/images/search-gray.png" />
    </div>

    {{for i,v of [1,2,3,4]}}
    <div w-class="item">
        <widget w-tag="chat-client-app-widget-imgShow-imgShow" w-class="avatar">{imgURL:{{it.avatar}}, width:"80px;"}</widget>
        <div style="flex:1 0 0;">
            <div w-class="username">
                {{it.username}}
                <img src="../../res/images/girl.png"/>
            </div>
            <div w-class="desc">{{it.desc}}</div>
        </div>
        {{if it.followed}}
        <div w-class="itemBtn">取消关注</div>
        {{else}}
        <div style="background:#CCCCCC" w-class="itemBtn">关注</div>
        {{end}}
    </div>
    {{end}}
</div>