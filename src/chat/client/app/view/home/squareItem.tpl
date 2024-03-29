<div w-class="item">
    <div w-class="top">
        <widget w-tag="chat-client-app-widget1-imgShow-imgShow" w-class="userHead" on-tap="goUserDetail">{imgURL:{{it.postItem.avatar || '../../res/images/user_avatar.png'}}, width:"80px;"}</widget>
        <div w-class="topCenter">
            <div style="display:flex;align-items:center;">
                <span style="font-size: 32px; font-weight: 500;">{{it.postItem.username}}&nbsp;</span>
                {{if it.isPublic}}
                <div w-class="offical">公众号</div>
                {{elseif it.offical}}
                <div w-class="offical">官方</div>
                {{else}}
                    {{if it.postItem.gender!=2}}
                        <img style="margin-left: 10px;" src="../../res/images/{{it.postItem.gender===1?'girl.png':'boy.png'}}"/>
                    {{else}}
                        <img style="margin-left: 10px;" src="../../res/images/neutral.png"/>
                    {{end}}
                {{end}}
            </div>
        </div>
        <div></div> 
        {{if !it.isMine && !it.postItem.followed}}
            {{if it.fgStatus}}
            <div w-class="followIng">
                <img src="../../res/images/loading.gif" alt="" style="width: 42px;height: 42px;"/>
            </div>
            {{else}}
            <div w-class="follow" on-tap="followUser">关注</div>
            {{end}}
        {{end}}
        <img src="../../res/images/greyDown.png" w-class="btn" on-tap="showTools"/>
    </div>

    {{if it.showAll}}
    {{% =================帖子详情展示全部内容=======================}}
        {{if it.postItem.content}}
        <div w-class="content1" id="minImg">
            {{ if it.postItem.isPublic }}
                <img src="{{ it.buildupImgPath(it.parseContent(it.postItem.content).imgs) }}" />
                <widget w-tag="pi-ui-html" id="minImg">{{ it.parseContent(it.postItem.content).msg }}</widget>
            {{ else }}
                <widget w-tag="pi-ui-html" id="minImg">{{ it.postItem.content }}</widget>
            {{ end }}
        </div>
        {{end}}
    {{else}}
        {{% ======================广场展示部分内容===========================}}
        {{if it.postItem.content}}
            {{ if it.postItem.isPublic }}
                <img src="{{ it.buildupImgPath(it.parseContent(it.postItem.content).imgs) }}" />
                <widget w-tag="pi-ui-html" id="minImg">{{ it.parseContent(it.postItem.content).msg }}</widget>
                <span w-class="allBtn">...<span style="color:#2A56C6">【全文】</span></span>
            {{ else }}
                <widget w-tag="pi-ui-html" id="minImg">{{ it.postItem.content }}</widget>
                <span w-class="allBtn">...<span style="color:#2A56C6">【全文】</span></span>
            {{ end }}
        {{end}}
    {{end}}

    {{% =====================图片区域========================}}
    <div style="margin:0px 50px 10px 125px;" on-tap="goDetail">
        {{for i,v of it.postItem.imgs}}
            {{if v}}
                {{if it.postItem.imgs.length==1}}
                <img src="{{it.buildupImgPath(v.compressImg)}}" alt="" w-class="firstImage" on-tap="showBigImg({{i}})" style="max-width:{{it.imgWidth}}px;max-height:{{it.imgHeight}}px;"/>
                {{else}}
                    {{if it.postItem.imgs.length==4}}
                        {{if i==2}}
                        <div></div>
                        {{end}}
                    {{end}}
                    <widget w-tag="chat-client-app-widget1-imgShow-imgShow" w-class="image" on-tap="showBigImg({{i}})">{imgURL:{{it.buildupImgPath(v.compressImg)}}, width:"{{it.postItem.imgs.length==1?'230px':'180px'}}",height:"{{it.postItem.imgs.length==1?'230px':'180px'}}",notRound:true}</widget>
                {{end}}
            {{end}}
        {{end}}
    </div>

    {{% ===========================游戏标签========================}}
    {{if it.gameLabel.name!=''}}
    <div w-class="gameLabel" on-tap="goLabel">
        <img src="{{it.gameLabel.icon}}" alt="" w-class="labelImg"/>
        <div>{{it.gameLabel.name}}</div>
    </div>
    {{end}}

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
        <div w-class="time" style="flex:1;">{{it.timeFormat(it.postItem.createtime,3)}}</div>
       <div w-class="btnGroup">
            <div w-class="btnBox" on-tap="doComment">
                <img src="../../res/images/commentsGrey.png" w-class="btn"/>
                <span w-class="time">{{it.postItem.commentCount>0?(it.postItem.commentCount>99?'99+':it.postItem.commentCount):"0"}}</span>
            </div>
            <div w-class="btnBox" on-tap="likeBtn">
                <img src="../../res/images/{{it.likeActive?'like_active.png':'likeGrey.png'}}" w-class="btn" />
                <span w-class="time">{{it.postItem.likeCount>0?(it.postItem.likeCount>99?'99+':it.postItem.likeCount):"0"}}</span>
            </div>
       </div>
    </div>
    {{end}}
    <div w-class="utils" style="display:{{it.showUtils?'block':'none'}}">
        {{if it.isMine}}
        <div w-class="option" on-tap="delPost">删除</div>
        {{else}}
        <div w-class="option" on-tap="followUser">{{it.postItem.followed ? "取消关注":"关注"}}</div>
        <div w-class="option" on-tap="complaint">举报</div>
        {{end}}
    </div>
</div>