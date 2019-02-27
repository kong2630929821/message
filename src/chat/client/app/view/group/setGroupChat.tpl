<div w-class="set-groupChat-wrap" class="new-page">
    <div w-class="top-main-wrap" ev-next-click="completeClick" ev-back-click="back">
        <chat-client-app-widget-topBar-topBar>{title:"创建群聊({{it.inviteMembers.length}}/500)",nextImg:"{{it.isSelect?'complete_blue.png':'complete_gray.png'}}"}</chat-client-app-widget-topBar-topBar>
    </div>
    <div w-class="group-info-wrap">
        <div w-class="group-avatar-wrap" on-tap="selectImageClick">
            {{if it.avatarHtml}}
            <widget w-tag="pi-ui-html" style="width:120px">{{it.avatarHtml}}</widget>
            {{else}}
            <img w-class="group-camera" src="../../res/images/group_camera.png" />
            {{end}}
        </div>
        <div w-class="groupName" ev-input-change="inputName">
            <chat-client-app-widget-input-input>{placeHolder:"群名",input:{{it.name}},style:"width:500px;padding:20px 0;border-bottom:solid #318DE6 1px;"}</chat-client-app-widget-input-input>
        </div>
    </div>
    
    {{if it.createNpg}}
    <div w-class="npgBtn" on-tap="createNPG">创建入群无需同意的群组</div>
    {{end}}

    <div w-class="a-part" ev-changeSelect="changeSelect">
        {{for index,item of it1.friends}}
        <div ev-addMember="addMember" style="position:relative;">
            <chat-client-app-widget-selectUser-selectUser>{id:{{item}}, chatType: "user"}</chat-client-app-widget-selectUser-selectUser>
        </div>
        {{end}}
    </div>
</div>