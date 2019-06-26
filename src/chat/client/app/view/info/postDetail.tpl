<div class="new-page" w-class="page" ev-back-click="goBack">
    <chat-client-app-widget-topBar-topBar>{title:"{{it.title}}",nextImg:"{{it.isPublic?'../../res/images/more-dot-blue.png':''}}"}</chat-client-app-widget-topBar-topBar>
    <div w-class="contain">
        <div style="margin: 20px 0;">
            {{if it.isPublic}}
            <div w-class="title">公众号最新新闻帖子标题公众号最新新闻帖子标题</div>
            {{end}}
            <widget w-tag="chat-client-app-view-home-squareItem">{showAll:true}</widget>

            <div w-class="commentBox">
                <div w-class="tabs">
                    <div w-class="tab {{it.active=='comment'? 'activeTab':''}}" on-tap="changeTab('comment')">评论&nbsp;{{it.num[1]}}</div>
                    <div w-class="tab {{it.active=='like'? 'activeTab':''}}" on-tap="changeTab('like')">赞&nbsp;{{it.num[2]}}</div>
                </div>
                {{if it.active == 'comment'}}
                <div>
                    {{for i,v of [1,2,3]}}
                    <widget w-tag="chat-client-app-view-info-commentItem"></widget>
                    {{end}}
                </div>
                {{else}}
                <div>
                    {{for i,v of [1,2,3,4]}}
                    <div w-class="likeItem">
                        <widget w-tag="chat-client-app-widget-imgShow-imgShow" w-class="userHead">{imgURL:{{it.avatar}}, width:"80px;"}</widget>
                        <div w-class="titleCenter">
                            <div w-class="username">
                                <span>用户1&nbsp;</span>
                                {{if it.offical}}
                                <div>官方</div>
                                {{else}}
                                <img src="../../res/images/{{it.sex?'girl.png':'boy.png'}}"/>
                                {{end}}
                            </div>
                            <div w-class="time">3-12 10:24 赞了动态</div>
                        </div>
                    </div>
                    {{end}}
                </div>
                {{end}}
            </div>
        </div>
    </div>

    <div w-class="btns">
        <div style="display:flex;align-items: center" on-tap="doComment">
            <img src="../../res/images/comment.png" w-class="btn"/>
            <span w-class="time">{{it.commentNum>0?it.commentNum:"评论"}}</span>
        </div>
        <div style="display:flex;align-items: center" on-tap="likeBtn">
            <img src="../../res/images/{{it.likeActive?'like_active.png':'like.png'}}" w-class="btn" />
            <span w-class="time">{{it.likeNum>0?it.likeNum:"点赞"}}</span>
        </div>
    </div>
</div>