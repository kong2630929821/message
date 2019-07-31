<div w-class="new-page" class="new-page" on-tap="pageClick">
    <div w-class="top-main-wrap" ev-next-click="getMore" ev-back-click="goBack(false)">
        <chat-client-app-widget-topBar-topBar>{title:"",nextImg:"{{it.utilList.length>0?'more-dot-white.png':''}}",background:"#318DE6"}</chat-client-app-widget-topBar-topBar>
        <div w-class="home-info-wrap" style="{{it.inFlag == 3 ? 'margin-top: 50px;':''}}">
            <widget w-tag="chat-client-app-widget-imgShow-imgShow" w-class="avatar" on-tap="showBigImg">{imgURL:{{it.avatar}},width:"190px;"}</widget>
            <div w-class="nameText">
                {{it.alias || it.userInfo.name || "------"}}

                {{if it.userInfo.level === 5}}
                    <span w-class="official">官方</span>
                {{end}}
            </div>
            {{if it.inFlag != 3}}
            <div on-tap="doCopy(0)" style="display:flex;flex-direction:column;text-align: center;">
                <div>昵称：{{it.userInfo.name||"------"}}</div>
            </div>
            {{end}}
        </div>
    </div>  

    <div w-class="detail-info-wrap">
        <div w-class="detail-info">
            <div w-class="adress-wrap" style="margin:60px 0 20px;" on-tap="doCopy(1)">
                <img w-class="adressIcon" src="../../res/images/adress-book.png" />
                <div w-class="adress-text-wrap">
                    <span w-class="mainText">
                        {{it.userInfo.acc_id || "------"}}
                        <img src="../../res/images/copy_gray.png" style="width:30px;"/>
                    </span>
                    <span w-class="flag">好嗨号</span>
                </div>
            </div>
            <div w-class="adress-wrap">
                <img w-class="adressIcon" src="../../res/images/phone.png" />
                <div w-class="adress-text-wrap">
                    <span w-class="mainText">未知</span>
                    <span w-class="flag">电话</span>
                </div>
            </div>
        </div>
        {{%====================不是好友且不是群主私聊且用户不是官方账号====================}}
        {{if !it.isFriend && !it.groupId && it.userInfo.level !== 5}}
        <div style="margin: 40px 80px;">
            <div w-class="liItem1" on-tap="addUser" on-down="onShow">加为好友</div>
        </div>
        {{%====================群主临时私聊======================}}
        {{elseif !it.isFriend && it.groupId}}
        <div style="margin: 40px 80px;">
            <div w-class="liItem1" on-tap="startChat" on-down="onShow">开始对话</div>
        </div>
        {{else}}

        <div w-class="other-wrap">
            {{% <!-- <img w-class="moreChooseIcon" src="../../res/images/more-choose.png" /> -->}}
            <ul w-class="ul-wrap">
               {{% <!-- <li w-class="liItem" style="padding-top:0;">搜索聊天记录</li> -->}}
                <li w-class="liItem" ev-switch-click="msgTop">
                    <span>聊天置顶</span>
                    <chat-client-app-widget-switch-switch>{types:{{it.msgTop}},activeColor:"linear-gradient(to right,#318DE6,#38CFE7)",inactiveColor:"#dddddd"}</chat-client-app-widget-switch-switch>
                </li>
                <li w-class="liItem" ev-switch-click="msgAvoid">
                    <span>消息免打扰</span>
                    <chat-client-app-widget-switch-switch>{types:{{it.msgAvoid}},activeColor:"linear-gradient(to right,#318DE6,#38CFE7)",inactiveColor:"#dddddd"}</chat-client-app-widget-switch-switch>
                </li>

                {{% ============================单聊进入不显示去聊天按钮======================}}
                {{if it.inFlag != 1}}
                    <div w-class="liItem1" on-tap="startChat" on-down="onShow">开始对话</div>
                {{end}}
            </ul>
        </div>
        {{end}}
    </div>
    {{if it.showUtils}}
    <div w-class="utilList1" style="">
        {{for i, v of it.utilList}}
            <div w-class="uitlItem" on-tap="utilClick({{i}})" on-down="onShow">
                <span>{{v.utilText}}</span>
            </div>
        {{end}}    
    </div>
    {{end}}
</div>