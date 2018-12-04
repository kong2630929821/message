{{let adminsButnoOwner = it.ginfo.adminids.filter(item => item !== it.ginfo.ownerid)}}
<div style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
    <div ev-back-click="goBack">
        <client-app-widget-topBar-topBar>{title:"设置管理员",background:"#fff"}</client-app-widget-topBar-topBar>
    </div>
    <div w-class="a-part" ev-changeSelect="changeSelect">
        <div w-class="a">管理员{{adminsButnoOwner.length}}/5</div>
        {{for index,item of adminsButnoOwner}}
        <client-app-widget-contactItem-contactItem>{{item}}</client-app-widget-contactItem-contactItem>
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

