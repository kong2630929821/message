<div w-class="page">
    <div w-class="cancle" on-tap="exit">返回上一页</div>
    {{if it.state===1}}
    <div w-class="deelArtice">
        <div w-class="titleObj">
            <div style="line-height: 40px;margin-left: 20px;">被举报动态</div>
            {{if it.isShowBtn}}
                <div style="display: flex;">
                    {{if it.returnDeel===0}}
                        <div w-class="deel" on-tap="unDeel" on-down="onShow">不处理</div>
                        <div w-class="deel" on-tap="deel" on-down="onShow">撤回</div>
                    {{else}}
                    <div w-class="deel" on-tap="freedPost" on-down="onShow">放出动态</div>
                    {{end}}
                </div>
            {{end}}
        </div>
        <div w-class="contentInfo">
            <div style="width:700px; margin: 30px auto;">
                <div w-class="userAvatarBox">
                    <img src="{{it.dynamic.avatar}}" alt="" w-class="avatar" on-tap="bigImg('11')"/>
                    <div w-class="dynamicDetails">
                        <div w-class="dynamicTitle">{{it.dynamic.name}}</div>
                        <div w-class="details">
                            <div>
                                <span>赞 {{it.dynamic.like}}</span>
                                <span style="margin-left:20px">评论 {{it.dynamic.commentCount}}</span>
                            </div>
                            <div>发布时间：{{it.dynamic.time}}</div>
                            <div>被举报次数：{{it.dynamic.count}}</div>
                        </div>
                    </div>
                </div>
                <div w-class="content">
                    <widget w-tag="pi-ui-html">{{it.dynamic.msg}}</widget>
                </div>
                {{if it.dynamic.imgs.length}}
                    {{for i,v of it.dynamic.imgs}}
                        <img src="{{v}}" alt="" w-class="imgBig" on-tap="bigImg('1111111')"/>
                    {{end}}
                {{end}}
            </div>
        </div>
    </div>
    {{end}}

    <div w-class="titleBox" style="margin-bottom:20px">
        <div w-class="titleObj">
            <div style="line-height: 40px;margin-left: 20px;">被举报人</div>
            {{if it.isShowBtn && it.state==0}}
                <div style="display: flex;">
                    {{if it.returnDeel===0}}
                        <div w-class="deel" on-tap="unDeel" on-down="onShow">不处理</div>
                        <div w-class="deel" on-tap="deel" on-down="onShow">处理</div>
                    {{else}}
                        <div w-class="deel" on-tap="freed" on-down="onShow">解除处罚</div>
                    {{end}}
                </div>
            {{end}}
        </div>
        <div w-class="ObjInfo">
            {{for i,v of it.userName}}
                <div w-class="item">
                    {{v.key}}：{{v.value}}
                    {{if v.key=='当前惩罚' && v.value!='无'}}
                        <span style="margin-left: 20px;">查看</span>
                    {{end}}
                    {{if v.fg}}
                    <img src="{{v.fg}}" alt="" w-class="sexImg"/>
                    {{end}}
                </div>
            {{end}}
        </div>
    </div>


    {{if it.state==1}}
    <div>
        <div w-class="titleObj">
            <div style="line-height: 40px;margin-left: 20px;">举报人</div>
        </div>
        <div w-class="reportdynamicUser">
            {{for i,v of it.reportInfoList}}
                <div w-class="userItem">
                    {{for j,t of v}}
                    <div style="width: 245px;">{{t.key}}:&nbsp;&nbsp;{{t.value}}
                        {{if t.fg}}
                        <img src="{{t.fg}}" alt="" w-class="sexImg"/>
                        {{end}}
                    </div>
                    {{end}}
                </div>
            {{end}}
        </div>
    </div>
    {{end}}


    {{if it.state==0}}
    <div w-class="bodyData">
        {{for index,item of it.reportInfoList}}
        <div w-class="reportInfo">
            <div w-class="titleObj">
                <div style="line-height: 40px;margin-left: 20px;">举报信息</div>
            </div>
            <div w-class="reportImg">
                {{for i,v of item}}
                    <div w-class="reportItem">
                        {{if i==0}}
                            <div>{{v.key}}：{{v.value.length?'':'无'}}</div>
                            {{if v.value.length}}
                                <div w-class="imgGroup">
                                    {{for j,t of v.value}}
                                        <img src="{{t}}" alt="" w-class="imgInfo" on-tap="bigImg({{v.value}})"/>
                                    {{end}}
                                </div>
                            {{end}}
                        {{elseif i==3}}
                            <div style="display:flex;width:100%;">
                                <div>{{v.key}}:</div>
                                <div w-class="reportUserInfo">
                                    {{for j,t of v.value}}
                                        <div>{{t.key}}:&nbsp;&nbsp;{{t.value}}
                                            {{if t.fg}}
                                            <img src="{{t.fg}}" alt="" w-class="sexImg"/>
                                            {{end}}
                                        </div>
                                    {{end}}
                                </div>
                            </div>    
                        {{else}}
                            <div>{{v.key}}：&nbsp;&nbsp;{{v.value}}</div>
                        {{end}}
                    </div>
                {{end}}
            </div>
        </div>
        {{end}}
    </div>
    {{end}}




    <div w-class="ctroller">
        <div ev-changeCurrent="pageChange" w-class="pagination" ev-perPage="perPage" ev-expand="expand">
            <widget w-tag="chat-management-components-pagination">{pages:{{Math.ceil(it.sum/ it.perPage)}},filterShow:true,currentIndex:{{it.currentIndex}},expand:{{it.expandIndex}},numberCheckActiveIndex:{{it.perPageIndex}} }</widget>
        </div>
    </div>


</div>