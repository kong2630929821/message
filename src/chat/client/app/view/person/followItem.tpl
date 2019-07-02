<div w-class="item">
    <widget w-tag="chat-client-app-widget-imgShow-imgShow" w-class="avatar">{imgURL:{{it.avatar}}, width:"80px;"}</widget>
    <div style="flex:1 0 0;">
        <div w-class="username">
            <span>{{it.username}}&nbsp;</span>
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