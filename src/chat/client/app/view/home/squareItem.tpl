<div w-class="item" on-tap="closeUtils">
    <div w-class="title">
        <widget w-tag="chat-client-app-widget-imgShow-imgShow" w-class="userHead">{imgURL:{{it.avatar}}, width:"80px;"}</widget>
        <div w-class="titleCenter">
            <div style="display:flex;align-items:center;">
                <span>{{it.username}}&nbsp;</span>
                {{if it.offical}}
                <div w-class="offical">官方</div>
                {{else}}
                <img src="../../res/images/{{it.sex?'girl.png':'boy.png'}}"/>
                {{end}}
            </div>
            <div w-class="time">{{it.time}}</div>
        </div>
        <div w-class="follow">+关注</div>
        <img src="../../res/images/squareArrow.png" w-class="btn" on-tap="showTools"/>
    </div>

    {{if it.showAll}}
    {{% =================帖子详情展示全部内容=======================}}
    <div w-class="content1">
        {{it.mess}}
    </div>

    {{else}}
    {{% ======================广场展示部分内容===========================}}
    <div w-class="content" on-tap="goDetail" class="content">
        {{it.mess}}
        <span w-class="allBtn">...<span style="color:#2A56C6">【全文】</span></span>
    </div>
    {{end}}

    {{% =====================图片区域========================}}
    <div style="margin:20px 15px;">
        {{for i,v of [1,2,3]}}
        <widget w-tag="chat-client-app-widget-imgShow-imgShow" w-class="image">{imgURL:"", width:"230px;",notRound:true}</widget>
        {{end}}
    </div>

    {{if !it.showAll}}
    {{% =====================广场展示评论点赞按钮======================}}
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
    {{end}}

    <div w-class="utils" style="display:{{it.showUtils?'block':'none'}}">
        <div w-class="option">删除</div>
        <div w-class="option">关注</div>
        <div w-class="option">举报</div>
    </div>
</div>