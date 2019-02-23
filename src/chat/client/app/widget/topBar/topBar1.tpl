{{let opca = it.scrollHeight/200 || 0}}
<div style="{{opca>0?'background:rgba(255, 255, 255, '+ opca +');border-bottom: 1px solid #cccccc;':''}}" w-class="topBar">
    <app-components1-blankDiv-topDiv></app-components1-blankDiv-topDiv>
    <div w-class="topBar-content">
        <div style=" display: flex;align-items: center;">
            <div on-tap="showMine" on-down="onShow">
                <widget w-tag="chat-client-app-widget-imgShow-imgShow" w-class="userHead">{imgURL:{{it.avatar || "../../res/images/user.png"}}, width:"48px;"}</widget>
            </div>
            {{if it.text}}
            <div w-class="total-asset">{{it.text}}</div>
            {{end}}
        </div>
        {{if it.nextImg}}
        <div style="position:absolute;right:90px;" on-down="onShow">
            <img on-tap="goNext" src="{{it.nextImg}}" w-class="btn" />
        </div>
        {{end}}
        <div style="position:absolute;right:0px;" on-down="onShow">
            <img src="../../res/images/{{opca>0?'refresh_blue.png':'refresh_white.png'}}" w-class="btn" on-tap="refreshPage" class="{{it.refresh ?'refreshing':''}}" />
        </div>
    </div>
</div>
    
