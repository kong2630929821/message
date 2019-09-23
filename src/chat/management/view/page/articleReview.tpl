<div w-class="page" on-tap="close">
    <div w-class="articleList">
        <div w-class="leftBox">
            {{for i ,v of it.showDataList}}
                <div w-class="{{i==it.active?'listItemActice':'listItem'}}" on-tap="checkedItem({{i}})">
                    <div w-class="titleBox">
                        <div w-class="title">{{v.title}}</div>
                        <div w-class="btn" on-tap="review({{i}})">审核</div>
                    </div>
                    <div w-class="titleBox">
                        <div w-class="userInfo">
                            <img src="{{v.avatar?v.avatar:'../../res/images/avatar1.png'}}" alt="" w-class="avatar"/>
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
        {{if it.activeData}}
        <div w-class="listItem">
            <div w-class="titleBox">
                <div w-class="title">{{it.activeData.title}}</div>
            </div>
            <div w-class="titleBox">
                <div w-class="userInfo">
                    <img src="{{it.activeData.avatar?it.activeData.avatar:'../../res/images/avatar1.png'}}" alt="" w-class="avatar"/>
                    <div w-class="userName">{{it.activeData.name}}</div>
                </div>
                <div w-class="userName">提交时间：{{it.activeData.createtime}}</div>
            </div>
        </div>
        <div w-class="articleContent">
            <div>
                <widget w-tag="pi-ui-html">{{it.activeData.body}}</widget>
            </div>
        </div>
        {{end}}
    </div>
</div>