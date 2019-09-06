<div w-class="item">
    <div w-class="top">
        <widget w-tag="chat-client-app-widget-imgShow-imgShow" w-class="userHead" on-tap="goUserDetail">{imgURL:{{it.avatar || '../../res/images/user_avatar.png'}}, width:"80px;"}</widget>
        <div w-class="topCenter">
            <div style="display:flex;align-items:center;">
                <span>{{it.username}}&nbsp;</span>
                {{if it.isPublic}}
                <div w-class="offical">公众号</div>
                {{elseif it.offical}}
                <div w-class="offical">官方</div>
                {{else}}
                <img src="../../res/images/{{it.gender?'girl.png':'boy.png'}}"/>
                {{end}}
            </div>
            <div w-class="time">{{it.timeFormat(it.createtime,3)}}</div>
        </div>
        {{if !it.followed}}
            {{if it.fgStatus}}
            <div w-class="followIng">
                <img src="../../res/images/loading.gif" alt="" style="width: 42px;height: 42px;"/>
            </div>
            {{else}}
            <div w-class="follow" on-tap="followUser">+关注</div>
            {{end}}
        {{end}}
        <img src="../../res/images/squareArrow.png" w-class="btn" on-tap="showTools"/>
    </div>

    {{if it.showAll}}
    {{% =================帖子详情展示全部内容=======================}}
    <div w-class="content1">
        <widget w-tag="pi-ui-html">{{it.content}}</widget>
    </div>

    {{else}}
    {{% ======================广场展示部分内容===========================}}
    <div w-class="content" on-tap="goDetail" class="content">
        <widget w-tag="pi-ui-html">{{it.content}}</widget>
        <span w-class="allBtn">...<span style="color:#2A56C6">【全文】</span></span>
    </div>
    {{end}}

    {{% =====================图片区域========================}}
    <div style="margin:20px 15px;width: 100%;" on-tap="goDetail">
        {{for i,v of it.imgs}}
            {{if i==2 && it.imgs.length==4}}
            <div></div>
            {{end}}
            <widget w-tag="chat-client-app-widget-imgShow-imgShow" w-class="image">{imgURL:{{it.urlPath + v}}, width:"{{it.imgs.length==1?'320px':'230px'}}",notRound:true}</widget>
        {{end}}
    </div>

    {{if it.showAll && it.isPublic}}
    {{% =================帖子详情页可分享=======================}}
    <div w-class="shareBtn" on-tap="shareArt">
        <img src="../../res/images/squareSahre.png" style="height:50px;margin-right: 10px;"/>
        分享给嗨友
    </div>
    {{end}}

    {{if !it.showAll}}
    {{% =====================广场展示评论点赞按钮======================}}
    <div w-class="btns">
        <div w-class="btnBox" on-tap="doComment">
            <img src="../../res/images/comment.png" w-class="btn"/>
            <span w-class="time">{{it.commentCount>0?it.commentCount:"评论"}}</span>
        </div>
        <div w-class="btnBox" on-tap="likeBtn">
            <img src="../../res/images/{{it.likeActive?'like_active.png':'like.png'}}" w-class="btn" />
            <span w-class="time">{{it.likeCount>0?it.likeCount:"点赞"}}</span>
        </div>
    </div>
    {{end}}

    <div w-class="utils" style="display:{{it.showUtils?'block':'none'}}">
        {{if it.isMine}}
        <div w-class="option" on-tap="delPost">删除</div>
        {{else}}
        <div w-class="option" on-tap="followUser">{{it.followed ? "取消关注":"关注"}}</div>
        <div w-class="option" on-tap="complaint">举报</div>
        {{end}}
    </div>
</div>