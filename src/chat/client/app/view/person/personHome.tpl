<div class="new-page" w-class="page">
    <app-components1-blankDiv-topDiv></app-components1-blankDiv-topDiv>
    <div w-class="topBar">
        <img src="../../res/images/left_arrow_blue.png" w-class="back" on-tap="goBack"/>
        <div w-class="tabs">
            <span w-class="tab {{it.activeTab==0?'activeTab':''}}" on-tap="changeTab(0)">动态</span>
            <span w-class="tab {{it.activeTab==1?'activeTab':''}}" on-tap="changeTab(1)">关注</span>
            <span w-class="tab {{it.activeTab==2?'activeTab':''}}" on-tap="changeTab(2)">粉丝</span>
        </div>
    </div>

    <div w-class="contain">
    {{if it.activeTab == 0}}
        {{% =================动态====================}}
        {{for i,v of it.postList}}
        <widget w-tag="chat-client-app-view-home-squareItem">{{v}}</widget>
        {{end}}

        {{if it.isMine}}
        <div w-class="btn" on-tap="sendPost">发动态</div>
        {{end}}

    {{elseif it.activeTab == 1}}
        {{% =================关注====================}}
        {{for i,v of it.followData}}
        <widget w-tag="chat-client-app-view-person-followItem">{{v}}</widget>
        {{end}}

    {{else}}
        {{% =================粉丝====================}}
        {{for i,v of it.fansData}}
        <widget w-tag="chat-client-app-view-person-followItem">{{v}}</widget>
        {{end}}
    {{end}}
    </div>
</div>