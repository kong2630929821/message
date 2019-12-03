{{let membersButnoOwner = it.ginfo.memberids.filter(item => item !== it.ginfo.ownerid)}}
<div class="new-page">
    <div ev-back-click="goBack">
        <chat-client-app-widget1-topBar-topBar>{title:"转让群主"}</chat-client-app-widget1-topBar-topBar>
    </div>
   
    <div w-class="userList">
        <div w-class="a">
            {{for index,item of membersButnoOwner}}
                <widget w-tag="chat-client-app-widget-selectUser-selectUser" on-tap="openConfirmTranBox({{item}})">{id:{{item}},chatType:"group",gid:{{it.gid}},disabled:true }</widget>
            {{end}}
        </div>
    </div>
</div>

