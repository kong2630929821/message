<div w-class="newPage" class="new-page">
    <app-publicComponents-blankDiv-topDiv></app-publicComponents-blankDiv-topDiv>
    <div w-class="topBar">
        <div w-class="createGroup" on-tap="back">取消</div>
        <div w-class="pageTitle">创建群</div>
        <div w-class="createGroup" on-tap="completeClick">创建</div>
    </div>

    <div w-class="group-info-wrap">
        {{for i,v of it.checkedList}}
            <div style="margin-left:20px;">
                <widget w-tag="chat-client-app-widget1-imgShow-imgShow" w-class="avatar">{imgURL:{{v.user_info.avatar}}, width:"120px;"}</widget>
            </div>
        {{end}}
    </div>
    
    <div w-class="userList" ev-changeSelect="changeSelect">
        <div w-class="a" ev-checked="checked">
            {{for i,v of it.followData}}
            <widget w-tag="chat-client-app-view-person-followItem">{data:{{v}},status:4,index:{{i}} }</widget>
            {{end}}
        </div>
    </div>
</div>