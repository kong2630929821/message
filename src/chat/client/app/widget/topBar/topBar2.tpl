{{let opca = it.scrollHeight/200 || 0}}
<div style="{{opca > 0 ? 'background:rgba(255, 255, 255, '+ opca +');border-bottom: 1px solid #cccccc;' : 'background:transparent;'}}" w-class="outter">
    <app-components1-blankDiv-topDiv></app-components1-blankDiv-topDiv>
    <div w-class="ga-top-banner">
        <div w-class="left-container" on-down="onShow">
            <img on-tap="backPrePage" src="../../res/images/{{opca>0 ? 'left_arrow_blue.png' : 'left_arrow_white.png'}}" w-class="ga-back" />
            <span on-tap="backPrePage"  style="color: {{opca>0 ? '#222':'#fff'}}">
                {{it.text}}
            </span>
            
        </div>
        {{if it.nextImg}}
        <div on-down="onShow">
            <img on-tap="goNext" src="../../res/images/{{it.nextImg}}" w-class="ga-next"/>
        </div>
        {{end}}
        
    </div>
</div>