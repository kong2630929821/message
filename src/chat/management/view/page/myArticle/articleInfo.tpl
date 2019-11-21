<div w-class="page" on-tap="close">
    <div w-class="body">
        <div w-class="leftBox">
            <div w-class="back">返回上一页</div>
            <div w-class="title">多元化的内容生态离不开每一位创作者的直播梦想和辛勤创作。</div>
            <div w-class="createTime">
                <div>上次编辑时间：2015-12-12</div>
                <div w-class="zan">
                    <div>评论 12</div>
                    <div style="margin-left:20px">赞 22</div>
                </div>
            </div>
            <div w-class="contentBox">
                <div w-class="content"></div>
            </div>
        </div>
        <div w-class="rightBox">
            <div w-class="tabar">
                <div w-class="tab">评论 12</div>
                <div w-class="tab activeTab">赞 13</div>
            </div>
            <div w-class="articleInfo"></div>
            <div w-class="ctroller">
                <div ev-changeCurrent="pageChange" w-class="pagination" ev-perPage="perPage" ev-expand="expand">
                    <widget w-tag="chat-management-components-pagination">{pages:{{Math.ceil(it.sum/ it.perPage)}},filterShow:true,currentIndex:{{it.currentIndex}},expand:{{it.expandIndex}},numberCheckActiveIndex:{{it.perPageIndex}} }</widget>
                </div>
            </div>
        </div>
    </div>
</div>