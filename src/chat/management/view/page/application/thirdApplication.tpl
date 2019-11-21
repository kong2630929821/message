<div w-class="page" on-tap="close">
    <div w-class="body">
        {{for i ,v of it.showDataList}}
            <div w-class="item" on-tap="goAppInif({{i}})">
                <widget w-tag="chat-management-components-applicationItem">{{v}}</widget>
            </div>
        {{end}}
    </div>
    <div w-class="ctroller">
        <div ev-changeCurrent="pageChange" w-class="pagination" ev-perPage="perPage" ev-expand="expand">
            <widget w-tag="chat-management-components-pagination">{pages:{{Math.ceil(it.sum/ it.perPage)}},filterShow:true,currentIndex:{{it.currentIndex}},expand:{{it.expandIndex}},numberCheckActiveIndex:{{it.perPageIndex}} }</widget>
        </div>
    </div>
</div>
