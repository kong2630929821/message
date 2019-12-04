<div class="new-page" w-class="page">
    <app-publicComponents-blankDiv-topDiv></app-publicComponents-blankDiv-topDiv>
    <div w-class="topBar">
        <img src="../../res/images/left_arrow_blue.png" w-class="back" on-tap="goBack"/>
        <div w-class="pageTitle">通讯录</div>
        <div w-class="createGroup" on-tap="createGroup">创建群</div>
    </div>

    <div w-class="tabs">
        <span w-class="tab {{it.activeTab==0?'activeTab':''}}" on-tap="changeTab(0)">我的关注</span>
        <span w-class="tab {{it.activeTab==1?'activeTab':''}}" on-tap="changeTab(1)">我的粉丝</span>
        <span w-class="tab {{it.activeTab==2?'activeTab':''}}" on-tap="changeTab(2)">我的群组</span>
        <span w-class="tab {{it.activeTab==3?'activeTab':''}}" on-tap="changeTab(3)">黑名单</span>
    </div>
    <div w-class="contain">
    {{if it.activeTab == 0}}

        {{% =================我的关注====================}}
        {{for i,v of it.followData}}
        <widget w-tag="chat-client-app-view-person-followItem">{data:{{v}},status:0 }</widget>
        {{end}}

    {{elseif it.activeTab == 1}}

        {{% =================粉丝====================}}
        {{for i,v of it.fansData}}
        <widget w-tag="chat-client-app-view-person-followItem">{data:{{v}},status:1}</widget>
        {{end}}

    {{elseif it.activeTab == 2}}

        {{% =================群====================}}
        {{for i,v of it1}}
        <widget w-tag="chat-client-app-widget-groupItem-groupItem">{gid:{{v}} }</widget>
        {{end}}

    {{elseif it.activeTab == 3}}

        {{% =================黑名单====================}}
        {{for i,v of it.blackList}}
        <div ev-remove-user="removeUser">
            <widget w-tag="chat-client-app-view-person-followItem">{data:{{v}},status:3}</widget>
        </div>
        {{end}}
    {{end}}
    </div>
</div>