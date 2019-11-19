<div w-class="topBar">
    <app-publicComponents-blankDiv-topDiv></app-publicComponents-blankDiv-topDiv>
   
    <div w-class="topBar-content">
        <div on-tap="showMine" on-down="onShow" style="position:relative;">
            <widget w-tag="chat-client-app-widget1-imgShow-imgShow" w-class="userHead">{imgURL:{{it.avatar}}, width:"48px;"}</widget>
            {{%<!-- <span w-class="newMess">99+</span> -->}}
        </div>
        
        <div w-class="tabs">
            {{if 1==1}}
            <div w-class="tab {{it.activeTab=='square'?'activeTab':''}}" on-tap="changeTab(e,'square')">
                {{it.showAcTag}}
                <span w-class="arrow {{it.showTag?'':'arrow1'}}"></span>
            </div>
            {{end}}

            <div w-class="tab {{it.activeTab=='message'?'activeTab':''}}" on-tap="changeTab(e,'message')">消息</div>
            {{if it.showSpot}}
                <span w-class="redSpot" ></span>
            {{end}}
        </div>
        <div style="width:90px;"></div>
        <div style="position:absolute;right:25px;" on-down="onShow">
            <img on-tap="goNext" src="../../res/images/{{it.activeTab=='square'?'squareBlue.png':'add_white.png'}}" w-class="btn" />
        </div>
    </div>

    {{if it.showUtils && it.activeTab=="square"}}
    <div w-class="utilList">
        <div w-class="util" on-tap="editPost(e,false)" on-down="onShow">写动态</div>
        <div on-tap="editPost(e,true)" on-down="onShow">发公众号消息</div>
    </div>
    {{elseif it.showUtils}}
    <div w-class="utilList1" style="">
        {{for i, v of it.utilList}}
            <div w-class="liItem" on-tap="utilClick(e,{{i}})" on-down="onShow">
                {{if v.iconPath}}
                    <img style="margin-right:20px;" src="../../res/images/{{v.iconPath}}" />
                {{end}}
                <span>{{v.utilText}}</span>
            </div>
        {{end}}    
    </div>
    {{end}}
</div>
