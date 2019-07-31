<div w-class="new-page" on-tap="pageClick" class="new-page" ev-next-click="getMore" ev-back-click="goBack(false)">
    {{if it.inFlag != 3}}
    <widget w-tag="chat-client-app-widget-topBar-topBar2">{text:"",nextImg:{{it.scrollHeight ? "more-dot-blue.png":"more-dot-white.png"}},scrollHeight:{{it.scrollHeight}} }</widget>
    {{else}}
    <widget w-tag="chat-client-app-widget-topBar-topBar">{title:"",background:"transparent"}</widget>
    {{end}}
    <div w-class="scroll-container" on-scroll="scrollPage" id="groupInfo">
    <div w-class="top-main-wrap" >
        <div w-class="home-info-wrap">
            {{if it.avatarHtml}}
            <widget w-tag="pi-ui-html" style="width:190px">{{it.avatarHtml}}</widget>
            {{else}}
            <widget w-tag="chat-client-app-widget-imgShow-imgShow" w-class="avatar" on-tap="selectAvatar">{imgURL:{{it.avatar}},width:"190px;"}</widget>
            {{end}}

            <div w-class="nameText">
                {{if it.editable}}
                <div ev-input-change="groupAliasChange" on-tap="editGroupAlias" ev-input-blur="changeGroupAlias">
                    <widget w-tag="chat-client-app-widget-input-input" w-class="groupAliasInput">{input:{{it.groupAlias}},style:"background:transparent;padding:0;color: #fff;" }</widget>
                </div>
                {{else}}
                    <span>{{it.groupAlias || it.groupInfo.name || "------"}}</span>
                    {{if it.groupInfo.level == 5}}
                        <span w-class="official">官方</span>
                    {{end}}
                {{end}}
                {{if it.isOwner}}
                <img w-class="edit" src="../../res/images/edit_gray.png" on-tap="editGroupAlias"/>
                {{end}}
            </div>
            <div>群号：{{it.groupInfo.gid || "------"}}</div>
        </div>
    </div>
   
    <div w-class="outter">
        <div w-class="detail-info-wrap">
            <div w-class="detail-info">
                <div w-class="adress-wrap" on-tap="openGroupAnnounce">
                    <img w-class="adressIcon" src="../../res/images/sound.png" />
                    <div w-class="adress-text-wrap">
                        <span w-class="mainText">{{it.lastAnnounce.title}}</span>
                        <span w-class="flag">{{it.lastAnnounce.content}}</span>
                    </div>
                </div>
                <div w-class="adress-wrap" style="margin:0;">
                    <img w-class="adressIcon" src="../../res/images/group-code.png" />
                    <div w-class="adress-text-wrap">
                        <span w-class="mainText">{{it.groupInfo.gid || "------"}}</span>
                        <span w-class="flag">群号</span>
                    </div>
                </div>
            </div>
            <div w-class="other-wrap">
                {{if it.inFlag == 3}}
                    <div style="margin: 0 60px 20px;">
                        <div w-class="liItem1" on-tap="applyGroup(e)" on-down="onShow">加入群</div>
                    </div>
                {{else}}
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
                        {{if it.isAdmin}}
                        <div w-class="liItem1" style="color: #222222;" on-tap="openGroupManage">群管理</div>
                        {{end}}
                        
                        {{% ============================群聊进入不显示去聊天按钮======================}}
                        {{if it.inFlag != 2}}
                        <div w-class="liItem1" on-tap="openGroupChat(e)" on-down="onShow">开始聊天</div>
                        {{end}}
                    </ul>
                {{end}}
            </div>
        </div>

        <div w-class="a-part">
            <div w-class="a">成员（{{it.members.length}}/500）</div>
            {{if it.inFlag != 3}}
            <div w-class="member-wrap" on-tap="openGroupMember">
                <img w-class="grouperIcon" src="../../res/images/add_group_user.png" />
                {{for i, v of it.members}}
                    {{if i < 5 }}
                    <widget w-tag="chat-client-app-widget-imgShow-imgShow" w-class="grouperIcon">{imgURL:{{v || "../../res/images/user_avatar.png"}}, width:"88px"}</widget>
                    {{end}}
                {{end}}
                <img w-class="more" src="../../res/images/more-gray.png" />
            </div>
            {{end}}
        </div>
    </div>

    {{if it.showUtils}}
    <div w-class="utilList" style="">
        {{for i, v of it.utilList}}
            <div w-class="uitlItem" on-tap="utilClick({{i}})" on-down="onShow">
                <span>{{v.utilText}}</span>
            </div>
        {{end}}    
    </div>
    {{end}}
    </div>
</div>