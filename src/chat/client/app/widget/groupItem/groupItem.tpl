<div w-class="item">
    <widget w-tag="chat-client-app-widget1-imgShow-imgShow" w-class="avatar">{imgURL:{{it.avatar}}, width:"80px;"}</widget>
    <div style="flex:1 0 0;">
        <div w-class="username">
            <span>{{it.name}}&nbsp;</span>
            {{if it.offical}}
            <div w-class="offical">官方</div>
            {{end}}
            
        </div>
        <div w-class="desc">{{it.msg || "简介"}}</div>
    </div>
    
    <div w-class="btnGroup">
        <img src="../../res/images/comment.png" alt="" w-class="chat"/>
    </div>
</div>