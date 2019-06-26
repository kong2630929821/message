<div class="new-page" w-class="page">
    <app-components1-blankDiv-topDiv></app-components1-blankDiv-topDiv>
    <div w-class="topBar">
        <img src="../../res/images/left_arrow_blue.png" w-class="back"/>
        <div w-class="tabs">
            <span w-class="tab {{it.activeTab==0?'activeTab':''}}" on-tap="changeTab(0)">动态</span>
            <span w-class="tab {{it.activeTab==1?'activeTab':''}}" on-tap="changeTab(1)">关注</span>
            <span w-class="tab {{it.activeTab==2?'activeTab':''}}" on-tap="changeTab(2)">粉丝</span>
        </div>
    </div>

    <div w-class="contain">
    {{if it.activeTab == 0}}
        {{% =================动态====================}}
        {{for i,v of [1,2,3,4]}}
        <widget w-tag="chat-client-app-view-home-squareItem"></widget>
        {{end}}

        <div w-class="btn">发动态</div>

    {{elseif it.activeTab == 1}}
        {{% =================关注====================}}
        {{for i,v of [1,2,3,4]}}
        <widget w-tag="chat-client-app-view-person-followItem"></widget>
        {{end}}

    {{else}}
        {{% =================粉丝====================}}
        {{for i,v of [1,2,3,4]}}
        <widget w-tag="chat-client-app-view-person-followItem"></widget>
        {{end}}
    {{end}}
    </div>
</div>