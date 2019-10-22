{{let flag=it.background && it.background!='' && it.background!='#fff'}}
{{let flag1=it.background && it.background!=''}}
<div w-class="outer {{flag1?'':'outer-bottom'}}" style="background: {{it.background}}">
    <app-publicComponents-blankDiv-topDiv></app-publicComponents-blankDiv-topDiv>
    <div w-class="ga-top-banner" >
        <div w-class="left-container" on-down="onShow">
            <img on-tap="backPrePage" src="../../res/images/{{flag ? 'left_arrow_white.png' : 'left_arrow_blue.png'}}" w-class="ga-back" />
            <span on-tap="backPrePage" style="color: {{flag?'#fff':''}}" w-class="title">{{it.title}}</span>
            {{if it.text}}
            <span style="font-size: 32px;color: {{flag?'#fff':''}}">{{it.text}}</span>
            {{end}}
        </div>
        {{if it.nextImg}}
        <div on-down="onShow">
            <img on-tap="goNext" src="../../res/images/{{it.nextImg}}" w-class="ga-next" />
        </div>
        {{end}}
        
    </div>
</div>