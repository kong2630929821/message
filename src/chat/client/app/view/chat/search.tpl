<div class="new-page" w-class="page">
    <app-components1-blankDiv-topDiv></app-components1-blankDiv-topDiv>
    <div w-class="topBar">
        <img src="../../res/images/left_arrow_blue.png" w-class="back" on-tap="goBack"/>
        <div w-class="input" ev-input-change="inputUid">
            <widget w-tag="chat-client-app-widget-input-input">{placeHolder:"用户名/ID/手机号",input:{{it.search}},style:"border-radius:34px;background:#F9F9F9;font-size:28px;padding-left:65px"}</widget>
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

        {{if fgChat}}
            <div style="background:#fff;margin-top:20px">
                <div w-class="title">
                    <span w-class="mark"></span>
                    <span style="flex:1 0 0;">聊天记录</span>
                    <img src="../../res/images/arrowRight.png"/>
                </div>
                {{for i,v of it.chatHistory}}
                    <div w-class="content">
                        <widget w-tag="chat-client-app-view-contactList-contactItem">{text:{{v.text}}, img:{{v.img}},msg:{{v.msg}},addType:"加好友" }</widget>
                    </div>
                {{end}}
            </div>
        {{end}}

        {{if fgFriend}}
            <div style="background:#fff;margin-top:20px">
                <div w-class="title">
                    <span w-class="mark"></span>
                    <span style="flex:1 0 0;">好友</span>
                    <img src="../../res/images/arrowRight.png"/>
                </div>
                {{for i,v of it.friendList}}
                    <div w-class="content" ev-addType="addFriend({{i}})">
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
                    <img src="../../res/images/arrowRight.png"/>
                </div> 
                {{for i,v of it.groupList}}
                    <div w-class="content" ev-addType="addGroup({{i}})">
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
                    <img src="../../res/images/arrowRight.png"/>
                </div>
                {{for i,v of it.postList}}
                    <div w-class="content">
                        <widget w-tag="chat-client-app-view-contactList-contactItem">{text:{{v.text}}, img:{{v.img}} }</widget>  
                    </div>
                {{end}}
            </div>
        {{end}}

        {{if (!fgChat && !fgFriend && !fgGroup && !fgPost) ||  it.searchAll}}
            <div style="background:#fff;margin-top:20px" on-tap="searchAllType" on-down="onShow">
                <div w-class="searchAll">
                    <img style="width: 80px;height: 80px;" src="../../res/images/searchAll.png" alt=""/>
                    <div w-class="searchAllRight">
                        <div w-class="searchItem">
                            搜索
                            <b w-class="searchValue">{{it.search}}</b>
                        </div>
                        <div w-class="searchNoitc">搜索更多相关内容</div>
                    </div>
                </div>
            </div>
        {{end}}
    </div>
</div>