<div style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
    <client-app-widget-topBar-topBar>{title:"转让管理员",background:"#fff"}</client-app-widget-topBar-topBar>
    <div w-class="search-input">
        <client-app-widget-input-input>{placeHolder : "搜索成员",style : "font-size:32px;color:#ccc;padding-left:82px;"}</client-app-widget-input-input>
        <img w-class="searchIcon" src="../../res/images/search-gray.png" />
    </div>
    <div w-class="a-part" ev-changeSelect="changeSelect">
        <div w-class="a">a</div>
        <div w-class="user-wrap" ev-transferAdmin="openConfirmTranBox">
            {{for index,item of it.userList}}
            <client-app-widget-contactItem-contactItem>{{item}}</client-app-widget-contactItem-contactItem>
            {{end}}
        </div>
    </div>
</div>

