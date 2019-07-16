<div class="new-page" w-class="page">
    <app-components1-blankDiv-topDiv></app-components1-blankDiv-topDiv>
    <div w-class="topBar">
        <img src="../../res/images/left_arrow_blue.png" w-class="back" on-tap="goBack"/>
        <div w-class="input" ev-input-change="inputUid">
            <widget w-tag="chat-client-app-widget-input-input">{placeHolder:"用户名/ID/手机号",style:"border-radius:34px;background:#F9F9F9;font-size:28px;padding-left:65px"}</widget>
            <img w-class="searchIcon" src="../../res/images/search-gray.png" />
        </div>
        <div w-class="searchBtn">搜索</div>
    </div>
    <div w-class="contain">
        <div style="background:#fff;margin-top:20px">
            <div w-class="title">
                <span w-class="mark"></span>
                <span style="flex:1 0 0;">好友</span>
                <img src="../../res/images/arrowRight.png"/>
            </div>
            <div w-class="content">
                <widget w-tag="chat-client-app-view-contactList-contactItem">{text:"玩家昵称", img:"../../res/images/user_avatar.png" }</widget>
            </div>
        </div>
        
        <div style="background:#fff;margin-top:20px">
            <div w-class="title">
                <span w-class="mark"></span>
                <span style="flex:1 0 0;">群聊</span>
                <img src="../../res/images/arrowRight.png"/>
            </div>
            <div w-class="content">
                <widget w-tag="chat-client-app-view-contactList-contactItem">{text:"群名", img:"../../res/images/groups.png" }</widget>
                <widget w-tag="chat-client-app-view-contactList-contactItem">{text:"群名", img:"../../res/images/groups.png" }</widget>
            </div>
        </div>

        <div style="background:#fff;margin-top:20px">
            <div w-class="title">
                <span w-class="mark"></span>
                <span style="flex:1 0 0;">公众号</span>
                <img src="../../res/images/arrowRight.png"/>
            </div>
            <div w-class="content">
                <widget w-tag="chat-client-app-view-contactList-contactItem">{text:"公众号", img:"../../res/images/user_avatar.png" }</widget>
                <widget w-tag="chat-client-app-view-contactList-contactItem">{text:"公众号", img:"../../res/images/user_avatar.png" }</widget>
                <widget w-tag="chat-client-app-view-contactList-contactItem">{text:"公众号", img:"../../res/images/user_avatar.png" }</widget>
            </div>
        </div>

    </div>
</div>