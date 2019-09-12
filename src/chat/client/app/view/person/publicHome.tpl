<div class="new-page" w-class="page" ev-back-click="goBack" ev-next-click="showUtils" on-tap="closeUtils">
    <widget w-tag="chat-client-app-widget-topBar-topBar">{title:"",background:"#fff",nextImg:"more-dot-blue.png"}</widget>
    <div w-class="contain">
        <div w-class="topBox">
            <widget w-tag="chat-client-app-widget-imgShow-imgShow" w-class="avatar">{imgURL:{{it.avatar || '../../res/images/user_avatar.png'}},width:"190px;"}</widget>
            <div w-class="nameText">{{it.name}}</div>
            <div w-class="numList">
                <span style="margin-right:40px;">{{it.totalPost}}&nbsp;篇文章</span>
                <span>{{it.totalFans}}&nbsp;个粉丝</span>
            </div>
            <div w-class="follow">
                <span style="flex:1 0 0;">公众id：{{it.pubNum}}</span>
                {{if it.isMine}}
                <span style="flex:1 0 0;" on-tap="sendArticle">发公众号消息</span>
                {{else}}
                <span style="flex:1 0 0;" on-tap="followBtn">{{it.followed ? "取消关注":"关注ta"}}</span>
                {{end}}
            </div>
        </div>
        <div style="height:20px;background:#F2F2F2"></div>

        {{for i,v of it.postList}}
        <div w-class="item" on-tap="goDetail({{i}})">
            <widget w-tag="chat-client-app-widget-imgShow-imgShow" w-class="itemImg">{imgURL:{{v.img}},width:"150px;",notRound:true}</widget>
            <div w-class="itemTitle">{{v.title}}</div>
        </div>
        {{end}}

        {{if it.showTool}}
        <div w-class="utils">
            <div w-class="util" on-tap="recomment">推荐给朋友</div>
            {{if it.isMine}}
            <div w-class="util" on-tap="changePublic">修改资料</div>
            {{end}}
            <div></div>
            {{if !it.isMine}}
            <div>举报</div>
            {{end}}
        </div>
        {{end}}
    </div>
    
</div>