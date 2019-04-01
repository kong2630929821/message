<div w-class="topBar">
    <app-components1-blankDiv-topDiv></app-components1-blankDiv-topDiv>
   
    <div w-class="topBar-content">
        <div on-tap="showMine" on-down="onShow">
            <widget w-tag="chat-client-app-widget-imgShow-imgShow" w-class="userHead">{imgURL:{{it.avatar || "../../res/images/user_avatar.png"}}, width:"48px;"}</widget>
        </div>
        
        <div w-class="tabs">
            <div w-class="tab {{it.activeTab=='message'?'activeTab':''}}" on-tap="changeTab(e,'message')">消息</div>
            <div w-class="tab {{it.activeTab=='friend'?'activeTab':''}}" on-tap="changeTab(e,'friend')">好友</div>
            {{if it.showSpot}}
                <span w-class="redSpot" ></span>
            {{end}}
        </div>
        <div style="width:90px;"></div>

        <div style="position:absolute;right:0;" on-down="onShow">
            <img on-tap="goNext" src="../../res/images/add_white.png" w-class="btn" />
        </div>
    </div>

</div>
