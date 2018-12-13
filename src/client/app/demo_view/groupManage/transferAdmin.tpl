{{let membersButnoOwner = it.ginfo.memberids.filter(item => item !== it.ginfo.ownerid)}}
<div class="new-page">
    <div ev-back-click="goBack">
        <client-app-widget-topBar-topBar>{title:"转让群主",background:"#fff"}</client-app-widget-topBar-topBar>
    </div>
    <div w-class="search-input">
        <client-app-widget-input-input>{placeHolder : "搜索成员",style : "font-size:32px;color:#ccc;padding-left:82px;"}</client-app-widget-input-input>
        <img w-class="searchIcon" src="../../res/images/search-gray.png" />
    </div>
    <div w-class="a-part" ev-changeSelect="changeSelect">
        <div w-class="a">a</div>
        <div w-class="user-wrap" ev-transferAdmin="openConfirmTranBox">
            {{for index,item of membersButnoOwner}}
            <div on-tap="openConfirmTranBox({{item}})">
                <client-app-demo_view-contactList-contactItem>{"id":{{item}},chatType:"user"}</client-app-demo_view-contactList-contactItem>
            </div>
            {{end}}
        </div>
    </div>
</div>

