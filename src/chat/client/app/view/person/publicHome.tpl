<div class="new-page" w-class="page" ev-back-click="goBack" ev-next-click="showUtils">
    <widget w-tag="chat-client-app-widget-topBar-topBar">{title:"",background:"#fff",nextImg:"more-dot-blue.png"}</widget>
    <div w-class="contain">
        <div w-class="topBox">
            <widget w-tag="chat-client-app-widget-imgShow-imgShow" w-class="avatar">{imgURL:"../../res/images/user_avatar.png",width:"190px;"}</widget>
            <div w-class="nameText">好嗨休闲平台</div>
            <div w-class="numList">
                <span style="margin-right:40px;">114 篇文章</span>
                <span>159 个粉丝</span>
            </div>
            <div w-class="follow">
                <span style="margin-right:200px;">公众id：00000000</span>
                {{if it.isMine}}
                <span>进入公众号</span>
                {{else}}
                <span>取消关注</span>
                {{end}}
            </div>
        </div>
        <div style="height:20px;background:#F2F2F2"></div>

        {{for i,v of [1,2,3,4]}}
        <div w-class="item">
            <widget w-tag="chat-client-app-widget-imgShow-imgShow" w-class="itemImg">{imgURL:"",width:"150px;",notRound:true}</widget>
            <div w-class="itemTitle">公众号消息标题公众号公众号消息标题公众号公众号消</div>
        </div>
        {{end}}

        {{if it.isMine}}
        <div w-class="btn">发动态</div>
        {{else}}
        <div w-class="more">更多消息</div>
        {{end}}

        {{if it.showTool}}
        <div w-class="utils">
            <div w-class="util">推荐给朋友</div>
            {{if !it.isMine}}
            <div>举报</div>
            {{end}}
        </div>
        {{end}}
    </div>
    
</div>