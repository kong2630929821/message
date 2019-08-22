<div w-class="item">
    <widget w-tag="chat-client-app-widget-imgShow-imgShow" w-class="avatar">{imgURL:{{it.avatar || '../../res/images/user_avatar.png'}}, width:"80px;"}</widget>
    <div style="flex:1 0 0;">
        <div w-class="username">
            <span>{{it.name}}&nbsp;</span>
            {{if it.isPublic}}
            <div w-class="offical">公众号</div>
            {{elseif it.offical}}
            <div w-class="offical">官方</div>
            {{else}}
            <img src="../../res/images/{{it.gender?'girl.png':'boy.png'}}"/>
            {{end}}
        </div>
        <div w-class="desc">{{it.note}}</div>
    </div>
    {{if it.followed}}
    <div w-class="itemBtn">取消关注</div>
    {{else}}
    <div style="background:#CCCCCC" w-class="itemBtn">关注</div>
    {{end}}
</div>