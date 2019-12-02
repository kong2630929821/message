<div w-class="page" on-tap="close">
    <div w-class="body">
        <div w-class="leftBox">
                <div w-class="goBack" on-tap="goBack(false,e)">返回上一页</div>
            <div w-class="title">{{ it.articleData[0].title }}</div>
            <div w-class="createTime">
                <div>上次编辑时间：{{ it.articleData[0].time }}</div>
                <div w-class="zan">
                    <div>评论 {{ it.articleData[0].commentCount }}</div>
                    <div style="margin-left:20px">赞 {{ it.articleData[0].likeCount }}</div>
                </div>
            </div>
            <div w-class="contentBox">
                <div w-class="content" id="articleBody">{{ it.articleData[0].body }}</div>
            </div>
        </div>
        <div w-class="rightBox">
            <div w-class="tabar">
                <div w-class="tab {{it.active != 'comment' ? 'activeTab':'' }}" on-tap ='changeTab(1)'>评论&nbsp;{{it.dataList[0].commentCount}}</div>
                <div w-class="tab {{it.active == 'comment' ? 'activeTab':'' }}" on-tap ='changeTab(2)'>赞 &nbsp;{{it.dataList[0].likeCount}}</div>
            </div>
            
            <div w-class="postBottom">
                    {{if it.active == 'comment'}}
                    <div id="commentBox" on-tap="pageClick" style="font-size: 14px;">
                        {{for i,v of it.commentList}}
                        <div ev-comment-reply="rePaint" ev-comment-delete="rePaint" ev-tools-expand="expandTools(e,{{i}})" ev-close="pageClick">
                            <widget w-tag="chat-management-view-page-myArticle-commentItem">{{it.dealData(v,true)}}</widget>
                        </div>
                        {{end}}
                    </div>
                    {{ else }}
                    <div on-tap="pageClick ">
                        {{for i,v of it.likeList}}
                        <div w-class="likeItem">
                            <widget w-tag="chat-client-app-widget1-imgShow-imgShow" w-class="userHead">{imgURL:{{v.avatar || '../../res/images/user_avatar.png'}}, width:"40px;height:40px;"}</widget>
                            <div w-class="titleCenter">
                                <div w-class="username">
                                    <span>{{v.username}}&nbsp;</span>
                                    {{if it.offical}}
                                    <div>官方</div>
                                    {{else}}
                                        {{if it.gender!=2}}
                                            <img src="../../res/images/{{it.gender===1?'girl.png':'boy.png'}}"/>
                                        {{else}}
                                            <img src="../../res/images/neutral.png"/>
                                        {{end}}
                                    {{end}}
                                </div>
                                <div w-class="time">{{it.timeFormat(v.createtime,3)}} 赞了动态</div>
                            </div>
                        </div>
                        {{end}}
                    </div>
                    {{end}}
                </div>
            <div w-class="ctroller">
                <div ev-changeCurrent="pageChange" w-class="pagination" ev-perPage="perPage" ev-expand="expand">
                    <widget w-tag="chat-management-components-pagination">{pages:{{Math.ceil(it.sum/ it.perPage)}},filterShow:true,currentIndex:{{it.currentIndex}},expand:{{it.expandIndex}},numberCheckActiveIndex:{{it.perPageIndex}} }</widget>
                </div>
            </div>
        </div>
    </div>
</div>