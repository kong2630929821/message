<div w-class="item">
    <widget w-tag="chat-client-app-widget1-imgShow-imgShow" w-class="avatar">{imgURL:{{it.avatar}}, width:"80px;"}</widget>
    <div style="flex:1 0 0;">
        <div w-class="username">
            <span>{{it.data.user_info.name}}&nbsp;</span>
            {{if it.isPublic}}
            <div w-class="offical">公众号</div>
            {{elseif it.offical}}
            <div w-class="offical">官方</div>
            {{else}}

            {{if it.data.user_info.sex!=2}}
                <img src="../../res/images/{{it.data.user_info.sex===1?'girl.png':'boy.png'}}"/>
            {{else}}
                <img src="../../res/images/neutral.png"/>
            {{end}}
            
            {{end}}
        </div>
        <div w-class="desc">{{it.data.user_info.note || "简介"}}</div>
    </div>
    
    <div w-class="btnGroup">
        {{if it.status!==-1}}
            {{if it.status==0 || it.status==1}}
                <div w-class="btn {{it.followed?'':'activeBtn'}}"  on-tap="followUser">{{it.followed?'取关':'关注'}}</div>
                <img src="../../res/images/comment.png" alt="" w-class="chat"/>
            {{elseif it.status==2}}
                <img src="../../res/images/comment.png" alt="" w-class="chat"/>
            {{elseif it.status==3}}
                <div w-class="blackBtn">放出</div>
            {{end}}
        {{else}}
            {{if !it.isMine}}
            <div w-class="itemBtn {{it.followed ? '':'active'}}"  on-tap="followUser">{{it.followed ? "取消关注":"关注"}}</div>
            {{end}}
        {{end}}
    </div>
</div>