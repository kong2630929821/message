{{let flag=it.background && it.background!='' && it.background!='#fff'}}
{{let flag1=it.background && it.background!=''}}
<div w-class="outer {{flag1?'':'outer-bottom'}}" style="background: {{it.background}}">
    <app-components1-blankDiv-topDiv></app-components1-blankDiv-topDiv>
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
    </div>
</div>