<div style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
    <client-app-widget-topBar-topBar>{title:"群成员",background:"#fff"}</client-app-widget-topBar-topBar>
    <div w-class="search-input" ev-input-change="inputMember">
        <client-app-widget-input-input>{placeHolder : "搜索成员",style : "font-size:32px;color:#ccc;padding-left:82px;"}</client-app-widget-input-input>
        <img w-class="searchIcon" src="../../res/images/search-gray.png" />
    </div>
    <div w-class="member-wrap">
        <client-app-widget-memberItem-memberItem>{avatorPath:"member-op.png",text:"添加成员",isOrdinary:true}</client-app-widget-memberItem-memberItem>
        <client-app-widget-memberItem-memberItem>{avatorPath:"member-op.png",text:"移除成员",isOrdinary:true}</client-app-widget-memberItem-memberItem>
        {{for index,item of it.memberList}}
        <client-app-widget-memberItem-memberItem>{{item}}</client-app-widget-memberItem-memberItem>
        {{end}}
    </div>
</div>

