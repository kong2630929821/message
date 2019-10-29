<div w-class="item">
    <widget w-tag="chat-client-app-widget1-imgShow-imgShow" w-class="avatar">{imgURL:{{it.avatar}}, width:"80px;"}</widget>
    <div style="flex:1 0 0;">
        <div w-class="username">
            <span>{{it.user_info.name}}&nbsp;</span>
            {{if it.isPublic}}
            <div w-class="offical">公众号</div>
            {{elseif it.offical}}
            <div w-class="offical">官方</div>
            {{else}}
            <img src="../../res/images/{{it.sex?'girl.png':'boy.png'}}"/>
            {{end}}
        </div>
        <div w-class="desc">{{it.user_info.note || "简介"}}</div>
    </div>
    {{if !it.isMine}}
    <div w-class="itemBtn {{it.followed ? '':'active'}}"  on-tap="followUser">{{it.followed ? "取消关注":"关注"}}</div>
    {{end}}
</div>