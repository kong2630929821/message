<div class="new-page" w-class="page">
    <app-publicComponents-blankDiv-topDiv></app-publicComponents-blankDiv-topDiv>
    <div w-class="topBar">
        <img src="../../res/images/left_arrow_blue.png" w-class="back" on-tap="goBack"/>
        <div w-class="input" ev-input-change="inputUid">
            <widget w-tag="chat-client-app-widget-input-input">{placeHolder:"搜索内容",input:{{it.search}},style:"border-radius:34px;background:#F9F9F9;font-size:28px;padding-left:65px",autofocus:true}</widget>
            <img w-class="searchIcon" src="../../res/images/search-gray.png" />
        </div>
        <div w-class="searchBtn" on-dowm="onShow" on-tap="searchBtn">搜索</div>
    </div>
    {{if it.searchAll}}
    <div w-class="searchTab">
        {{for i,v of it.sreachTab}}
            <div w-class="{{it.tabIndex==i?'activeTab':'tabItem'}}" on-tap="checkTab({{i}})">{{v}}</div>
        {{end}}
    </div>
    {{end}}
    <div w-class="contain">

        {{: fgChat = it.chatHistory.length }}
        {{: fgFriend = it.friendList.length }}
        {{: fgGroup =  it.groupList.length }}
        {{: fgPost = it.postList.length }}
        {{: fgArticle = it.articleList.length}}

        {{if fgChat}}
            <div style="background:#fff;margin-top:20px">
                <div w-class="title" on-tap="goAllChat" on-down="onShow">
                    <span w-class="mark"></span>
                    <span style="flex:1 0 0;">聊天记录</span>
                    <img src="../../res/images/arrowRight.png"/>
                </div>
                {{for i,v of it.chatHistory}}
                    {{if i < 3}}
                    <div w-class="content" on-tap="goTo(0,{{i}})" on-down="onShow">
                        <widget w-tag="chat-client-app-view-contactList-contactItem">{text:{{v.text}}, img:{{v.img}},msg:{{v.msg}} }</widget>
                    </div>
                    {{end}}
                {{end}}
            </div>
        {{end}}

        {{if fgFriend}}
            <div style="background:#fff;margin-top:20px">
                <div w-class="title">
                    <span w-class="mark"></span>
                    <span style="flex:1 0 0;">好友</span>
                </div>
                {{for i,v of it.friendList}}
                    <div w-class="content" ev-addType="addFriend({{i}})" on-down="onShow" on-tap="goTo(1,{{i}})">
                        <widget w-tag="chat-client-app-view-contactList-contactItem">{text:{{v.text}}, img:{{v.img}},addType:{{v.myself?'':(v.friend?'':(it.friendAdd[i]?'加好友':'已申请'))}} }</widget>
                    </div>
                {{end}}
            </div>
        {{end}}

        {{if fgGroup}}
            <div style="background:#fff;margin-top:20px">
                <div w-class="title">
                    <span w-class="mark"></span>
                    <span style="flex:1 0 0;">群聊</span>
                </div> 
                {{for i,v of it.groupList}}
                    <div w-class="content" ev-addType="addGroup({{i}})" on-down="onShow" on-tap="goTo(2,{{i}})">
                        <widget w-tag="chat-client-app-view-contactList-contactItem">{text:{{v.text}}, img:{{v.img}},addType:{{v.myself?'':(v.friend?'':(it.groupAdd[i]?'加群聊':'已申请'))}}  }</widget>
                    </div>
                {{end}}    
            </div>
        {{end}}

        {{if fgPost}}
            <div style="background:#fff;margin-top:20px">
                <div w-class="title">
                    <span w-class="mark"></span>
                    <span style="flex:1 0 0;">公众号</span>
                </div>
                {{for i,v of it.postList}}
                    <div w-class="content" ev-addType="addPost({{i}})" on-down="onShow" on-tap="goTo(3,{{i}})">
                        <widget w-tag="chat-client-app-view-contactList-contactItem">{text:{{v.text}}, img:{{v.img}},addType:{{v.myself?'':(v.friend?'':(it.postAdd[i]?'+关注':''))}}  }</widget>
                    </div>
                {{end}}
            </div>
        {{end}}

        {{if fgArticle}}
            <div style="background:#fff;margin-top:20px">
                <div w-class="title">
                    <span w-class="mark"></span>
                    <span style="flex:1 0 0;">文章</span>
                </div>
                {{for i,v of it.articleList}}
                    <div w-class="searchArticle" on-down="onShow" on-tap="goTo(4,{{i}})">
                        <div w-class="articleTitle">{{v.msg}}</div>
                        <div w-class="userInfo">
                            <widget w-tag="chat-client-app-widget-imgShow-imgShow" w-class="avatar" >{imgURL:{{v.img}},width:"40px;"}</widget>
                            <div w-class="userName">{{v.text}}</div>
                            <span w-class="official">公众号</span>
                        </div>
                    </div>
                {{end}}
            </div>
        {{end}}
        {{if it.searchAll}}
            {{if it.fgStatus||( !fgFriend && !fgGroup &&!fgPost && !fgArticle)}}
            <div w-class="no">没有结果</div>
            {{end}}
        {{else}}
            {{if (it.fgStatus||(fgChat || fgFriend || fgGroup || fgPost || fgArticle))}}
                <div style="background:#fff;margin-top:20px" on-tap="searchAllType" on-down="onShow">
                    <div w-class="searchAll">
                        <img style="width: 80px;height: 80px;" src="../../res/images/searchAll.png" alt=""/>
                        <div w-class="searchAllRight">
                            <div w-class="searchItem">搜索</div>
                            <div w-class="searchNoitc">搜索更多相关内容</div>
                        </div>
                    </div>
                </div>
            {{end}}
        {{end}}
    </div>
</div>