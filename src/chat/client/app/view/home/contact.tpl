<div w-class="new-page" class="new-page" on-tap="closeMore">
    <div w-class="topBack" ev-next-click="getMore" ev-contactTop-tab="changeTab" ev-util-click="closeMore">
        {{: show = it1.contactMap.applyUser.length + it1.contactMap.applyGroup.length + it1.inviteUsers.length + it1.convertUser.length}}
        <widget w-tag="chat-client-app-view-home-contactTop">{avatar:{{it.userInfo.avatar}},showSpot:{{show}},activeTab:{{it.activeTab}},acTag:{{it.acTag}},showUtils:{{it.isUtilVisible}},showTag:{{it.showTag}} }</widget>
        
    </div>
    <app-publicComponents-offlineTip-offlineTip>{ offlienType:{{it.offlienType}} }</app-publicComponents-offlineTip-offlineTip>
    {{for i, v of it.tabBarList}}
    <div ev-change-tag="labelChangeTag" style="visibility: {{v.modulName == it.activeTab ? 'visible' : 'hidden'}}; z-index:{{v.modulName == it.activeTab ? 0 :-1}}; position:absolute;top:164px;bottom: 110px; width:100%;">
        <widget  w-tag={{v.components}}>{isActive:{{v.modulName == it.activeTab}},active:{{it.acTag}},newApply:{{show}} }</widget>
        {{if it.showTag && i == 0}}
        <div w-props="hello" style="background:#fff;width:100%;padding-bottom: 20px;position: absolute;top:0;">
            <div w-class="title">分类标签</div>
            <div w-class="tagList">
                {{for i,v of it1.tagList.slice(0,2)}}
                <div w-class="tag" on-tap="changeTagItem({{i}},e)">{{v}}</div>
                {{end}}
            </div>
            <div w-class="title">游戏标签</div>
            <div w-class="tagList">
                {{for i,v of it1.tagList.slice(2)}}
                <div w-class="tag" on-tap="changeTagItem({{i+2}},e)">{{v}}</div>
                {{end}}
            </div>
        </div>
        {{end}}
    </div>
    {{end}}


    
</div>