{{let admins = it.ginfo.adminids}}
<div style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
    <div ev-back-click="goBack">
        <client-app-widget-topBar-topBar>{title:"设置管理员",background:"#fff"}</client-app-widget-topBar-topBar>
    </div>
    <div w-class="a-part" ev-changeSelect="changeSelect">
        <div w-class="a">管理员{{admins.length}}/5</div>
        {{for index,item of admins}}
        <div style="position:relative;">
            <client-app-widget-contactItem-contactItem>{id:{{item}},chatType:"user"}</client-app-widget-contactItem-contactItem>
            {{if item !== it.ginfo.ownerid}}
            <img on-tap="removeAdmin({{item}})" src="../../res/images/icon_remove.png" style="position:absolute;right:36px;top:36px;"/>
            {{else}}
            <span style="position:absolute;right:36px;top:45px;color:orange;font-size: 24px;">群主</span>
            {{end}}
        </div>
        {{end}}
        <div w-class="add-admin-wrap" on-tap="openAddAdmin">
            <div w-class="contact-wrap">
                <div w-class="avator-wrap">
                    <img w-class="avator" src="../../res/images/unfold.png" />
                </div>
                <span w-class="text">添加管理员</span>
            </div>
        </div>
    </div>
</div>

