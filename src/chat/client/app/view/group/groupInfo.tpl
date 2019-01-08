<div w-class="new-page" on-tap="pageClick" class="new-page" on-scroll="scrollPage" id="groupInfo">
    <div w-class="top-main-wrap" ev-next-click="handleMoreGroup" ev-back-click="goBack">
        <div style="position:relative;min-height: 128px;">
            {{if it.inFlag != 2}}
            <widget w-tag="chat-client-app-widget-topBar-topBar2">{text:"",nextImg:{{it.scrollHeight ? "more-dot-blue.png":"more-dot-white.png"}},scrollHeight:{{it.scrollHeight}} }</widget>
            {{else}}
            <widget w-tag="chat-client-app-widget-topBar-topBar">{title:"",background:"transparent"}</widget>
            {{end}}
        </div>
        <div w-class="home-info-wrap">
            <img w-class="avatar" src="../../res/images/img_avatar1.png" />
            <div w-class="nameText">
                {{if it.editable}}
                    <input type="text" value="{{it.groupAlias}}" w-class="groupAliasInput" maxlength="10" on-blur="changeGroupAlias" on-tap="editGroupAlias" on-input="groupAliasChange"/>
                {{else}}
                    {{it.groupAlias || it.groupInfo.name}}
                {{end}}
                {{if it.isOwner}}
                <img w-class="edit" src="../../res/images/edit_gray.png" on-tap="editGroupAlias"/>
                {{end}}
            </div>
            <div>群号：{{it.groupInfo.gid}}</div>
        </div>
    </div>
   
    <div w-class="outter">
        <div w-class="detail-info-wrap">
            <div w-class="detail-info">
                <div w-class="adress-wrap" on-tap="openGroupAnnounce">
                    <img w-class="adressIcon" src="../../res/images/sound.png" />
                    <div w-class="adress-text-wrap">
                        <span w-class="mainText">无</span>
                        <span w-class="flag">群公告</span>
                    </div>
                </div>
                <div w-class="adress-wrap" style="margin:0;">
                    <img w-class="adressIcon" src="../../res/images/group-code.png" />
                    <div w-class="adress-text-wrap">
                        <span w-class="mainText">群名片</span>
                        <span w-class="flag">群ID</span>
                    </div>
                </div>
            </div>
            <div w-class="other-wrap">
                {{if it.inFlag == 2}}
                    <div style="margin: 0 60px 20px;">
                        <div w-class="liItem1" on-tap="applyGroup(e)" >加入群</div>
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
                        {{if it.inFlag != 1}}
                        <div w-class="liItem1" style="margin-bottom: 40px;" on-tap="openGroupChat(e)">开始聊天</div>
                        {{end}}
                    </ul>
                {{end}}
            </div>
        </div>

        <div w-class="a-part">
            <div w-class="a">成员（{{it.members.length}}/500）</div>
            {{if it.inFlag != 2}}
            <div w-class="member-wrap" on-tap="openGroupMember">
                <img w-class="grouperIcon" src="../../res/images/add_group_user.png" />
                {{for i, v of it.members}}
                    {{if i < 5 }}
                    <img w-class="grouperIcon" src="../../res/images/user.png" />
                    {{end}}
                {{end}}
                <img w-class="more" src="../../res/images/more-gray.png" />
            </div>
            {{end}}
        </div>
    </div>

    {{if it.isGroupOpVisible}}
    <div w-class="utilList" ev-handleFatherTap="handleFatherTap">
        <chat-client-app-widget-utilList-utilList>{utilList:{{it.utilList}}}</chat-client-app-widget-utilList-utilList>
    </div>
    {{end}}
</div>