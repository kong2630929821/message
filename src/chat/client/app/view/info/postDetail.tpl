<div class="new-page" w-class="page" ev-back-click="goBack">
    <chat-client-app-widget-topBar-topBar>{title:"详情",nextImg:"{{it.isPublic?'../../res/images/more-dot-blue.png':''}}"}</chat-client-app-widget-topBar-topBar>
    <div w-class="contain">
        <div style="margin: 20px 0;">
            {{if it.isPublic}}
            <div w-class="title">{{it.title}}</div>
            {{end}}

            <widget w-tag="chat-client-app-view-home-squareItem">{{it}}</widget>

            <div w-class="commentBox">
                <div w-class="tabs">
                    <div w-class="tab {{it.active=='comment'? 'activeTab':''}}" on-tap="changeTab('comment')">评论&nbsp;{{it.commentCount}}</div>
                    <div w-class="tab {{it.active=='like'? 'activeTab':''}}" on-tap="changeTab('like')">赞&nbsp;{{it.likeCount}}</div>
                </div>
                {{if it.active == 'comment'}}
                <div>
                    {{for i,v of it.commentList}}
                    <div ev-comment-likeBtn="commentLikeBtn({{i}})">
                        <widget w-tag="chat-client-app-view-info-commentItem">{{v}}</widget>
                    </div>
                    {{end}}
                </div>
                {{else}}
                <div>
                    {{for i,v of it.likeList}}
                    <div w-class="likeItem">
                        <widget w-tag="chat-client-app-widget-imgShow-imgShow" w-class="userHead">{imgURL:{{v.avatar||"../../res/images/user_avatar.png"}}, width:"80px;"}</widget>
                        <div w-class="titleCenter">
                            <div w-class="username">
                                <span>{{v.username}}&nbsp;</span>
                                {{if it.offical}}
                                <div>官方</div>
                                {{else}}
                                <img src="../../res/images/{{it.gender?'girl.png':'boy.png'}}"/>
                                {{end}}
                            </div>
                            <div w-class="time">{{v.createtime}} 赞了动态</div>
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
            <span w-class="time">{{it.commentCount>0 ? it.commentCount:"评论"}}</span>
        </div>
        <div style="display:flex;align-items: center" on-tap="likeBtn">
            <img src="../../res/images/{{it.likeActive?'like_active.png':'like.png'}}" w-class="btn" />
            <span w-class="time">{{it.likeCount>0 ? it.likeCount:"点赞"}}</span>
        </div>
    </div>
</div>