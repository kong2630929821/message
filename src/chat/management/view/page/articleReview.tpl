<div w-class="page" on-tap="close">
    <div w-class="articleList">
        <div w-class="leftBox">
            {{for i ,v of it.showDataList}}
                <div w-class="listItem">
                    <div w-class="titleBox">
                        <div w-class="title">{{v.title}}</div>
                        <div w-class="btn" on-tap="review({{i}})">审核</div>
                    </div>
                    <div w-class="titleBox">
                        <div w-class="userInfo">
                            <img src="{{v.avatar}}" alt="" w-class="avatar"/>
                            <div w-class="userName">{{v.name}}</div>
                        </div>
                        <div w-class="userName">提交时间：{{v.createtime}}</div>
                    </div>
                </div>
            {{end}}
        </div>
        <div w-class="ctroller">
            <div ev-changeCurrent="pageChange" w-class="pagination" ev-perPage="perPage" ev-expand="expand">
                <widget w-tag="chat-management-components-pagination">{pages:{{Math.ceil(it.sum/ it.perPage)}},filterShow:true,currentIndex:{{it.currentIndex}},expand:{{it.expandIndex}},numberCheckActiveIndex:{{it.perPageIndex}} }</widget>
            </div>
        </div>
    </div>
    <div w-class="articleInfo">
        <div w-class="listItem">
            <div w-class="titleBox">
                <div w-class="title">{{it.activeData.title}}</div>
            </div>
            <div w-class="titleBox">
                <div w-class="userInfo">
                    <img src="{{it.activeData.avatar}}" alt="" w-class="avatar"/>
                    <div w-class="userName">{{it.activeData.name}}</div>
                </div>
                <div w-class="userName">提交时间：{{it.activeData.createtime}}</div>
            </div>
        </div>
        <div w-class="articleContent">
            <div>{{it.activeData.body.msg}}</div>
            {{if it.activeData.body.imgs.length}}
                {{for i,v of it.activeData.body.imgs}}
                    <img src="{{v}}" alt="" w-class="img"/>
                {{end}}
            {{end}}
        </div>
    </div>
</div>