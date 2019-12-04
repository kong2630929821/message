<div w-class="page">
    {{if !it.status}}
    <div w-class="list">
        {{%==================草稿数量大于零时显示草稿===================}}
        {{ if it.showDataList }}
            {{for i,v of it.showDataList}}
                <div w-class="draft">
                    <img  src="{{it.buildupImgPath(v.bannerImg)}}" w-class="banner" />
                    <div w-class="info">
                        <div w-class="title">{{v.title}}</div>
                        <div w-class="time">
                            <div>上次编辑时间：{{it.timeFormat(v.time)}}</div>
                            <div w-class="btnGroup">
                                <div on-tap="deleteDraft()">删除</div>
                                <div style="margin-left: 38px;" on-tap="editDraft({{i}})">编辑</div>
                            </div>
                        </div>
                    </div>
                </div>
            {{end}}
        {{end}}
    </div>
    {{else}}
    {{%==================查看详情===================}}
    <div ev-goBack="goBack">
        <widget w-tag="chat-management-view-page-myArticle-newArticle">{data:{{it.currenetData}} }</widget>
    </div>
    {{end}}
</div>