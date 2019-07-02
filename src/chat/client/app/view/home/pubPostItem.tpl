<div w-class="item" on-tap="closeUtils">
    <div w-class="title">公众号最新新闻帖子标题公众号最新新闻帖子标题</div>
    <div w-class="top">
        <widget w-tag="chat-client-app-widget-imgShow-imgShow" w-class="userHead" on-tap="goUserDetail">{imgURL:{{it.avatar}}, width:"40px;"}</widget>
        <div w-class="topCenter">
            <span>{{it.username}}&nbsp;</span>
            <div w-class="offical">公众号</div>        
        </div>
        {{if !it.followed}}
        <div w-class="follow">+关注</div>
        {{end}}
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
        {{for i,v of it.imgList}}
            {{if i==2 && it.imgList.length==4}}
            <div></div>
            {{end}}
            <widget w-tag="chat-client-app-widget-imgShow-imgShow" w-class="image">{imgURL:"", width:"{{it.imgList.length==1?'320px':'230px'}}",notRound:true}</widget>
        {{end}}
    </div>

    {{if it.showAll}}
    {{% =================公众号发布的帖子详情页可分享=======================}}
    <div w-class="shareBtn">
        <img src="../../res/images/squareSahre.png" style="height:50px;margin-right: 10px;"/>
        分享给嗨友
    </div>
    {{end}}

</div>