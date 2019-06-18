<div w-class="item" on-tap="closeUtils">
    <div w-class="title">
        <widget w-tag="chat-client-app-widget-imgShow-imgShow" w-class="userHead">{imgURL:{{it.avatar}}, width:"80px;"}</widget>
        <div w-class="titleCenter">
            <div style="display:flex;align-items:center;">
                <span>{{it.username}}&nbsp;</span>
                {{if it.offical}}
                <div>官方</div>
                {{else}}
                <img src="../../res/images/{{it.sex?'girl.png':'boy.png'}}"/>
                {{end}}
            </div>
            <div w-class="time">{{it.time}}</div>
        </div>
        <img src="../../res/images/comment.png" w-class="btn" style="margin-right:20px;" on-tap="showTools"/>
        <div on-tap="likeBtn" style="display:flex;align-items:center;">
            <img src="../../res/images/{{it.likeActive?'like_active.png':'like.png'}}" w-class="btn"/>
            <div w-class="time">{{it.likeNum}}</div>
        </div>
    </div>
    <div w-class="orgComment">
        <div w-class="content">
            <span style="font-weight: 600;">{{it.orgName}}:&nbsp;</span>
            {{it.orgMess}}
        </div>
    </div>
    <div w-class="comment">{{it.mess}}</div>

    <div w-class="utils" style="display:{{it.showUtils?'block':'none'}}">
        <div w-class="option" on-tap="replay">回复</div>
        <div w-class="option">删除</div>
        <div w-class="option">复制</div>
        <div w-class="option">举报</div>
    </div>
</div>