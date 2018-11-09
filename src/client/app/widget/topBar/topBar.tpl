{{let flag=it.background && it.background!='' && it.background!='#fff'}}
{{let flag1=it.background && it.background!=''}}
<div w-class="outer {{flag1?'':'outer-bottom'}}" style="background: {{it.background}}">
    <div w-class="ga-top-banner" >
        <div w-class="left-container">
            <img on-tap="backPrePage" src="../../res/images/{{flag ? 'left_arrow_white.png' : 'left_arrow_blue.png'}}" w-class="ga-back" />
            <span on-tap="backPrePage"  style="color: {{flag?'#fff':''}}" w-class="title">{{it.title}}</span>
        </div>
        {{if it.nextImg}}
        <img on-tap="goNext" src="../../res/images/{{it.nextImg}}" w-class="ga-next" />
        {{end}}
        {{if it.refreshImg}}
        <img on-tap="refreshPage" src="../../res/images/{{it.refreshImg}}" w-class="refreshBtn" class="{{it1.refresh?'refreshing':''}}"/>
        {{end}}
        {{if it.unfoldImg}}
        <img on-tap="unfold" src="../../res/images/{{it.unfoldImg}}" w-class="unfoldBtn" />
        {{end}}
        {{if it.moreImg}}
        <img on-tap="more" src="../../res/images/{{it.moreImg}}" w-class="more-dot" />
        {{end}}
        {{if it.completeImg}}
        <img on-tap="complete" src="../../res/images/{{it.completeImg}}" w-class="completeImg" />
        {{end}}
        {{if it.shareImg}}
        <img on-tap="share" src="../../res/images/{{it.shareImg}}" w-class="shareImg" />
        {{end}}
    </div>
</div>