<div class="new-page" w-class="page">
    <app-publicComponents-blankDiv-topDiv></app-publicComponents-blankDiv-topDiv>
    <div w-class="topBar">
        <img src="../../res/images/left_arrow_blue.png" w-class="back" on-tap="goBack"/>
        <div w-class="pageTitle">群资料</div>
        <div w-class="createGroup" on-tap="createGroup"></div>
    </div>
    <div w-class="avatarBox">
        <div>
            {{for i, v of it.members}}
                {{if i < 3 }}
                    <widget w-tag="chat-client-app-widget1-imgShow-imgShow" w-class="grouperIcon">{imgURL:{{v || "../../res/images/user_avatar.png"}}, width:"88px"}</widget>
                {{end}}
            {{end}}
        </div>
        <div>
            <img src="../../res/images/add_group_user.png" alt="" w-class="add" on-tap="openGroupMember"/>    
            <img src="../../res/images/del_group_user.png" alt="" w-class="add"/>    
        </div>
    </div>

    <div w-class="other">
        <div on-tap="uploadAvatar" on-down="onShow" ev-uploadAvatar="uploadAvatar">
            {{: itemTitle = [
            {"zh_Hans":"群头像","zh_Hant":"","en":""},
            {"zh_Hans":"群聊名称","zh_Hant":"群聊暱稱","en":""}, 
            {"zh_Hans":"群公告","zh_Hant":"群公告","en":""},  
            {"zh_Hans":"群管理","zh_Hant":"群管理","en":""}, 
            {"zh_Hans":"清空聊天记录","zh_Hant":"清空聊天记录","en":""},
            {"zh_Hans":"退出群","zh_Hant":"退出群","en":""}        

            ] }}
            <app-components-basicItem-basicItem>{name:{{itemTitle[0]}},img:true,chooseImage:{{it.chooseImage}},avatarHtml:{{it.avatarHtml}},avatar:{{it.avatar}} }</app-components-basicItem-basicItem>
        </div>
        <div on-tap="changeGroupAlias" on-down="onShow">
            <app-components-basicItem-basicItem>{name:{{itemTitle[1]}},describe:{{it.groupInfo.name}} }</app-components-basicItem-basicItem>
        </div>
    </div>

    <div w-class="other">
        <div on-tap="openGroupAnnounce" on-down="onShow">
            <app-components-basicItem-basicItem>{name:{{itemTitle[2]}},describe:{{it.lastAnnounce.title}} }</app-components-basicItem-basicItem>
        </div>
        <div on-tap="openGroupManage" on-down="onShow">
            <app-components-basicItem-basicItem>{name:{{itemTitle[3]}} }</app-components-basicItem-basicItem>
        </div>
    </div>
    <div w-class="other">
        <div w-class="item" on-tap="msgAvoid" on-down="onShow">
            <span>消息免打扰</span>
            <chat-client-app-widget-switch-switch>{types:{{it.msgAvoid}},activeColor:"linear-gradient(to right,#318DE6,#38CFE7)",inactiveColor:"#dddddd"}</chat-client-app-widget-switch-switch>
        </div>
        <div w-class="item" on-tap="msgTop" on-down="onShow">
            <span>聊天置顶</span>
            <chat-client-app-widget-switch-switch>{types:{{it.msgTop}},activeColor:"linear-gradient(to right,#318DE6,#38CFE7)",inactiveColor:"#dddddd"}</chat-client-app-widget-switch-switch>
        </div>
    </div>
    <div w-class="other">
        <div on-tap="clearChat" on-down="onShow">
            <app-components-basicItem-basicItem>{name:{{itemTitle[4]}} }</app-components-basicItem-basicItem>
        </div>
        <div on-tap="exitGroup" on-down="onShow">
            <app-components-basicItem-basicItem>{name:{{itemTitle[5]}} }</app-components-basicItem-basicItem>
        </div>
    </div>
</div>