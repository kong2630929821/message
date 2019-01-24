<div w-class="new-page" class="new-page" on-tap="pageClick">
    <div w-class="top-main-wrap" ev-next-click="handleMoreContactor" ev-back-click="goBack">
        <chat-client-app-widget-topBar-topBar>{title:"",nextImg:"more-dot-white.png",background:"#318DE6"}</chat-client-app-widget-topBar-topBar>
        <div w-class="home-info-wrap" style="{{it.inFlag == 3 ? 'margin-top: 50px;':''}}">
            <widget w-tag="chat-client-app-widget-imgShow-imgShow" w-class="avatar" >{imgURL:{{it.avatar}},width:"190px;"}</widget>
            <div w-class="nameText">
                {{it.alias || it.userInfo.name}}
            </div>
            {{if it.inFlag != 3}}
            <div on-tap="doCopy(0)" style="display:flex;flex-direction:column;text-align: center;">
                <div>ID：{{it.uid}}</div>
                <div>昵称：{{it.userInfo.name}}</div>
            </div>
            {{end}}
        </div>
    </div>  

    <div w-class="detail-info-wrap">
        <div w-class="detail-info">
            <div w-class="adress-wrap" on-tap="doCopy(1)">
                <img w-class="adressIcon" src="../../res/images/adress-book.png" />
                <div w-class="adress-text-wrap">
                    <span w-class="mainText">{{it.uid}}</span>
                    <span w-class="flag">ID</span>
                </div>
            </div>
            <div w-class="adress-wrap" on-tap="doCopy(2)">
                <img w-class="adressIcon" src="../../res/images/phone.png" />
                <div w-class="adress-text-wrap">
                    <span w-class="mainText">{{it.userInfo.tel ? it.userInfo.tel : "未知"}}</span>
                    <span w-class="flag">电话</span>
                </div>
            </div>
        </div>
        {{if it.inFlag == 3 || !it.isFriend}}
        <div style="margin: 40px 80px;">
            <div w-class="liItem1" on-tap="addUser(e)" >加为好友</div>
        </div>
        {{else}}
        <div w-class="other-wrap">
            <img w-class="moreChooseIcon" src="../../res/images/more-choose.png" />
            <ul w-class="ul-wrap">
                <li w-class="liItem" style="padding-top:0;">搜索聊天记录</li>
                <li w-class="liItem" ev-switch-click="msgTop">
                    <span>聊天置顶</span>
                    <chat-client-app-widget-switch-switch>{types:{{it.msgTop}},activeColor:"linear-gradient(to right,#318DE6,#38CFE7)",inactiveColor:"#dddddd"}</chat-client-app-widget-switch-switch>
                </li>
                <li w-class="liItem" ev-switch-click="msgAvoid">
                    <span>消息免打扰</span>
                    <chat-client-app-widget-switch-switch>{types:{{it.msgAvoid}},activeColor:"linear-gradient(to right,#318DE6,#38CFE7)",inactiveColor:"#dddddd"}</chat-client-app-widget-switch-switch>
                </li>

                {{if it.inFlag != 1}}
                    <div w-class="liItem1" on-tap="startChat(e)">开始对话</div>
                {{end}}
            </ul>
        </div>
        {{end}}
    </div>
    {{if it.isContactorOpVisible && it.isFriend}}
    <div w-class="contactorOpList" ev-handleFatherTap="handleFatherTap">
        <chat-client-app-widget-utilList-utilList>{utilList:{{it.utilList}} }</chat-client-app-widget-utilList-utilList>
    </div>
    {{end}}
</div>