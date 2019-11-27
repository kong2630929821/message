<div w-class="page" on-tap="close">
    {{if it.status}}
    <div w-class="tabRow">
        被举报类别：
        <div w-class="{{it.returnDeel==0?'activeTitle':'title1'}}" on-tap="checkDeel(0)" on-down="onShow">待处理</div>
        <div w-class="{{it.returnDeel==1?'activeTitle':'title1'}}" on-tap="checkDeel(1)" on-down="onShow">已处理</div>
    </div>
    <div w-class="tabRow" style="margin-top: 20px;">
        被举报类别：
        <div w-class="{{it.returnStatus==0?'activeTitle':'title1'}}" on-tap="checkType(0)" on-down="onShow">玩家</div>
        <div w-class="{{it.returnStatus==1?'activeTitle':'title1'}}" on-tap="checkType(1)" on-down="onShow">动态</div>
    </div>
    <div ev-table-detail="goDetail" style="margin-top:37px;">
        <div w-class="tableTitle">数据列表</div>
        {{if it.returnDeel}}
            <widget w-tag="chat-management-components-table" style="max-height:550px;">{datas: {{it.showDataList}},title:{{it.showTitleList}},needCheckBox:false,btnGroup:{{it.showDataBtn}}}</widget>
        {{else}}
            <widget w-tag="chat-management-components-table" style="max-height:550px;">{datas: {{it.showDataList}},title:{{it.showTitleList}},needCheckBox:false,inlineBtn2:"查看详情"}</widget>
        {{end}}
    </div>
    <div w-class="ctroller">
        <div ev-changeCurrent="pageChange" w-class="pagination" ev-perPage="perPage" ev-expand="expand">
            <widget w-tag="chat-management-components-pagination">{pages:{{Math.ceil(it.sum/ it.perPage)}},filterShow:true,currentIndex:{{it.currentIndex}},expand:{{it.expandIndex}},numberCheckActiveIndex:{{it.perPageIndex}} }</widget>
        </div>
    </div>
    {{else}}
        <div style="height:100%" ev-exit="exit" ev-ok="ok">
            <widget w-tag="chat-management-view-page-complaint-toBeProcessedInfo">{data:{{it.currentDataId}},state:{{it.returnStatus}},returnDeel:{{it.returnDeel}} }</widget>
        </div>
    {{end}}
</div>