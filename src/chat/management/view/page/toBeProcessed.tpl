<div w-class="page" on-tap="close">
    {{if it.status}}
    <div w-class="tabRow">
        <div w-class="{{it.returnStatus==0?'activeTitle':'title1'}}" on-tap="checkType(0)" on-down="onShow">全部</div>
        <div w-class="{{it.returnStatus==1?'activeTitle':'title1'}}" on-tap="checkType(1)" on-down="onShow">用户</div>
        <div w-class="{{it.returnStatus==2?'activeTitle':'title1'}}" on-tap="checkType(2)" on-down="onShow">嗨嗨号</div>
        <div w-class="{{it.returnStatus==3?'activeTitle':'title1'}}" on-tap="checkType(3)" on-down="onShow">动态</div>
        <div w-class="{{it.returnStatus==4?'activeTitle':'title1'}}" on-tap="checkType(4)" on-down="onShow">文章</div>
        <div w-class="{{it.returnStatus==5?'activeTitle':'title1'}}" on-tap="checkType(5)" on-down="onShow">评论</div>
    </div>
    <div ev-table-detail="goDetail">
        <div w-class="tableTitle">数据列表</div>
        <widget w-tag="chat-management-components-table" style="max-height:550px;">{datas: {{it.showDataList}},title:{{it.showTitleList}},needCheckBox:false,inlineBtn2:"查看详情"}</widget>
    </div>
    <div w-class="ctroller">
        <div ev-changeCurrent="pageChange" w-class="pagination" ev-perPage="perPage" ev-expand="expand">
            <widget w-tag="chat-management-components-pagination">{pages:{{Math.ceil(it.sum/ it.perPage)}},filterShow:true,currentIndex:{{it.currentIndex}},expand:{{it.expandIndex}},numberCheckActiveIndex:{{it.perPageIndex}} }</widget>
        </div>
    </div>
    {{else}}
        <div style="height:100%" ev-exit="exit" ev-ok="ok">
            <widget w-tag="chat-management-view-page-toBeProcessedInfo">{data:{{it.currentData}}}</widget>
        </div>
    {{end}}
</div>