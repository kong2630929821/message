<div w-class="newPage" class="new-page">
    <app-publicComponents-blankDiv-topDiv></app-publicComponents-blankDiv-topDiv>
    <div w-class="topBar">
        <div w-class="createGroup" on-tap="back">取消</div>
        <div w-class="pageTitle">创建群</div>
        <div w-class="createGroup" on-tap="completeClick">创建</div>
    </div>

    <div w-class="group-info-wrap">
        {{for i,v of it.checkedList}}
            <div style="margin:20px 10px;">
                <widget w-tag="chat-client-app-widget1-imgShow-imgShow" w-class="avatar">{imgURL:{{v.user_info.avatar}}, width:"80px;"}</widget>
            </div>
        {{end}}
    </div>
    
    <div w-class="userList">
        <div w-class="a" >
            {{for i,v of it.followAndFans}}
            <div ev-checked="checked(e,{{i}})">
                <widget w-tag="chat-client-app-view-person-followItem">{data:{{v}},status:4 }</widget>
            </div>
            {{end}}
        </div>
    </div>
</div>