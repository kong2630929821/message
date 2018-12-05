{{let membersButnoOwnerAdmins = it.ginfo.memberids.filter(item => item !== it.ginfo.ownerid || it.ginfo.adminids.indexOf(item) === -1)}}
<div style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
    <div ev-back-click="goBack" ev-complete="completeAddAdmin">
        <client-app-widget-topBar-topBar>{title:"添加管理员",completeImg:"complete.png",background:"#fff"}</client-app-widget-topBar-topBar>
    </div>
    <div w-class="search-input">
        <client-app-widget-input-input>{placeHolder : "搜索成员",style : "font-size:32px;color:#ccc;padding-left:82px;"}</client-app-widget-input-input>
        <img w-class="searchIcon" src="../../res/images/search-gray.png" />
    </div>
    <div w-class="a-part" ev-changeSelect="changeSelect">
        <div w-class="a">a</div>
        {{for index,item of membersButnoOwnerAdmins}}
        <div on-tap="addAdminMember({{item}})">
            <client-app-widget-selectUser-selectUser>{uid:{{item}}}</client-app-widget-selectUser-selectUser>
        </div>
        {{end}}
    </div>
</div>

