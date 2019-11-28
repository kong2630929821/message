<div w-class="page" on-tap="close">
    {{if !it.isDetail}}
    <div w-class="list">
        {{for i,v of it.showDataList}}
            <div w-class="draft" on-tap="goDataills({{i}})">
                <img  src="{{v.banner}}" w-class="banner" />
                <div w-class="info">
                    <div w-class="title">{{v.title}}</div>
                    <div w-class="time">
                        <div>上次编辑时间：{{v.time}}</div>
                        <div w-class="btnGroup">
                            <div>评论 {{v.commentCount}}</div>
                            <div style="margin-left: 38px;">赞 {{v.likeCount}}</div>
                        </div>
                    </div>
                </div>
            </div>
        {{end}}
    </div>

    
    <div w-class="ctroller">
        <div ev-changeCurrent="pageChange" w-class="pagination" ev-perPage="perPage" ev-expand="expand">
            <widget w-tag="chat-management-components-pagination">{pages:{{Math.ceil(it.sum/ it.perPage)}},filterShow:true,currentIndex:{{it.currentIndex}},expand:{{it.expandIndex}},numberCheckActiveIndex:{{it.perPageIndex}} }</widget>
        </div>
    </div>
    {{else}}
    <div>
        <widget w-tag ="chat-management-view-page-myArticle-articleInfo">{{it.currentData}}</widget>
    </div>
    {{end}}
</div>