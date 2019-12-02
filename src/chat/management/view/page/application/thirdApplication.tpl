<div w-class="page" on-tap="close">
    {{if !it.status}}
    <div w-class="body">
        {{for i ,v of it.showDataList}}
            <div w-class="item" on-tap="goAppInif({{i}})">
                <widget w-tag="chat-management-components-applicationItem">{item:{{v}} }</widget>
            </div>
        {{end}}
    </div>
    <div w-class="ctroller">
        <div ev-changeCurrent="pageChange" w-class="pagination" ev-perPage="perPage" ev-expand="expand">
            <widget w-tag="chat-management-components-pagination">{pages:{{Math.ceil(it.sum/ it.perPage)}},filterShow:true,currentIndex:{{it.currentIndex}},expand:{{it.expandIndex}},numberCheckActiveIndex:{{it.perPageIndex}} }</widget>
        </div>
    </div>
    {{else}}

    {{%===============================查看详情===============================}}
    <div ev-goBack="goBack">
        <widget w-tag="chat-management-view-page-application-addApplication">{data:{{it.currentData}} }</widget>
    </div>
    {{end}}
</div>
