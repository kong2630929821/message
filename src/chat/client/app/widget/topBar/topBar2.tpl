{{let opca = it.scrollHeight/200 || 0}}
<div style="{{opca > 0 ? 'background:rgba(255, 255, 255, '+ opca +');border-bottom: 1px solid #cccccc;' : 'background:transparent;'}}" w-class="outter">
    <app-components1-blankDiv-topDiv></app-components1-blankDiv-topDiv>
    <div w-class="ga-top-banner">
        <div w-class="left-container">
            <img on-tap="backPrePage" src="../../res/images/{{opca>0 ? 'left_arrow_blue.png' : 'left_arrow_white.png'}}" w-class="ga-back" />
            <span on-tap="backPrePage"  style="color: {{opca>0 ? '#222':'#fff'}}">
                {{it.text}}
            </span>
            
        </div>
        {{if it.nextImg}}
        <img on-tap="goNext" src="../../res/images/{{it.nextImg}}" w-class="ga-next" />
        {{end}}
        {{if it.refreshImg}}
        <img on-tap="refreshPage" src="../../res/images/{{opca>0?'refresh_blue.png':'refresh_white.png'}}" w-class="refreshBtn" class="{{it1.refresh?'refreshing':''}}"/>
        {{end}}
    </div>
</div>