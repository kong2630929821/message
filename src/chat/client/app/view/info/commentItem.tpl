<div w-class="item" on-tap="closeUtils">
    <div w-class="title">
        <widget w-tag="chat-client-app-widget-imgShow-imgShow" w-class="userHead">{imgURL:{{it.avatar||"../../res/images/user_avatar.png"}}, width:"80px;"}</widget>
        <div w-class="titleCenter">
            <div style="display:flex;align-items:center;">
                <span>{{it.username}}&nbsp;</span>
                {{if it.offical}}
                <div>官方</div>
                {{else}}
                <img src="../../res/images/{{it.gender?'girl.png':'boy.png'}}"/>
                {{end}}
            </div>
            <div w-class="time">{{it.timeFormat(it.createtime,3)}}</div>
        </div>
        <img src="../../res/images/comment.png" w-class="btn" style="margin-right:20px;" on-tap="showTools"/>
        <div on-tap="likeBtn" style="display:flex;align-items:center;">
            <img src="../../res/images/{{it.likeActive?'like_active.png':'likeGrey.png'}}" w-class="btn"/>
            <div w-class="time">{{it.likeCount}}</div>
        </div>
    </div>
    {{if it.orgMess}}
    <div w-class="orgComment">
        <div w-class="content">
            <span style="font-weight: 600;">{{it.orgName}}:&nbsp;</span>
            <widget w-tag="pi-ui-html" style="display: inline-block;">{{it.orgMess}}</widget>
            {{if it.orgImg.length}}
                <span w-class="lookBigImg" on-tap="lookBigImg">【查看图片】</span>
            {{end}}
        </div>
    </div>
    {{end}}
    <div w-class="comment">
        <widget w-tag="pi-ui-html">{{it.mess}}</widget>
        {{if it.img}}
            <div on-tap="lookInfoImg">
                <widget w-tag="chat-client-app-widget-imgShow-imgShow" w-class="imgContent">{imgURL:{{it.img}}, width:"230px;",notRound:true}</widget>
            </div>
        {{end}}
    </div>

    <div w-class="utils" style="display:{{it.showUtils?'block':'none'}}">
        <div w-class="option" on-tap="replyComment">回复</div>
        {{if it.isMine}}
        <div w-class="option" on-tap="delComment">删除</div>
        {{end}}
        <div w-class="option" on-tap="copyComment">复制</div>
        {{if !it.isMine}}
        <div w-class="option" on-tap="complaint">举报</div>
        {{end}}
    </div>
</div>