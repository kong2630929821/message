{{let opca = it.scrollHeight/200 || 0}}
<div style="{{opca>0?'background:rgba(255, 255, 255, '+ opca +');border-bottom: 1px solid #cccccc;':''}}" w-class="topBar">
    <app-components1-blankDiv-topDiv></app-components1-blankDiv-topDiv>
    <div w-class="topBar-content">
        <div style=" display: flex;align-items: center;">
            <div on-tap="showMine">
                <widget w-tag="app-components1-img-img" w-class="userHead" >{imgURL:{{it.avatar ? it.avatar : 'app/res/image1/default_avatar.png'}},width:"48px;"}</widget>
            </div>
            {{if it.text}}
            <div w-class="total-asset">{{it.text}}</div>
            {{end}}
        </div>
        {{if it.nextImg}}
        <img on-tap="goNext" src="{{it.nextImg}}" w-class="nextBtn" />
        {{end}}
        <img src="../../res/images/{{opca>0?'refresh_blue.png':'refresh_white.png'}}" w-class="refreshBtn" on-tap="refreshPage" class="{{it.refresh ?'refreshing':''}}"/>
    </div>
</div>
    
