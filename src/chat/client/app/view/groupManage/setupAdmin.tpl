{{let admins = it.ginfo.adminids}}
<div class="new-page">
    <div ev-back-click="goBack">
        <chat-client-app-widget1-topBar-topBar>{title:"设置管理员"}</chat-client-app-widget1-topBar-topBar>
    </div>
    <div w-class="a-part" ev-changeSelect="changeSelect">
        <div w-class="a">管理员{{admins.length}}/5</div>
        {{for index,item of admins}}
        <div style="position:relative;">
            <widget w-tag="chat-client-app-widget-selectUser-selectUser">{id:{{item}},chatType:"group",gid:{{it.gid}},disabled:true }</widget>
            {{if item !== it.ginfo.ownerid}}
            <img on-tap="removeAdmin({{item}})" src="../../res/images/icon_remove.png" style="position:absolute;right:36px;top:36px;"/>
            {{else}}
            <span w-class="mainPerson">群主</span>
            {{end}}
        </div>
        {{end}}
        <div style="height:120px;" on-tap="openAddAdmin">
            <div w-class="contact-wrap">
                <div w-class="avatar-wrap">
                    <img w-class="avatar" src="../../res/images/add_group_user.png" />
                </div>
                <span w-class="text">添加管理员</span>
            </div>
        </div>
    </div>
</div>

