<div w-class="page">
    <div w-class="cancle" on-tap="exit">返回上一页</div>
    {{if it.state==1 || it.state==2}}
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
                    <img src="{{it.dynamic.avatar}}" alt="" w-class="avatar"/>
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

                {{if it.dynamic.title}}
                    <div w-class="artTitle">{{it.dynamic.title}}</div>
                {{end}}

                {{if it.state==2}}
                    {{if it.dynamic.imgs.length}}
                        {{for i,v of it.dynamic.imgs}}
                            <img src="{{v}}" alt="" w-class="imgBig" on-tap="bigImg('{{v}}')"/>
                        {{end}}
                    {{end}}
                {{end}}
                <div w-class="content">
                    <widget w-tag="pi-ui-html">{{it.dynamic.msg}}</widget>
                </div>
                {{if it.state==1}}
                    {{if it.dynamic.imgs.length}}
                        {{for i,v of it.dynamic.imgs}}
                            <img src="{{v}}" alt="" w-class="imgBig" on-tap="bigImg('{{v}}')"/>
                        {{end}}
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
                    {{if v.fg||v.fg==0}}
                        {{if v.fg!=2}}
                            <img src="../../../res/images/{{v.fg===1?'girl.png':'boy.png'}}" w-class="sexImg"/>
                        {{else}}
                            <img src="../../../res/images/neutral.png" w-class="sexImg"/>
                        {{end}}
                    {{end}}
                </div>
            {{end}}
        </div>
    </div>


    {{if it.state==1 || it.state==2}}
    <div>
        <div w-class="titleObj">
            <div style="line-height: 40px;margin-left: 20px;">举报人</div>
        </div>
        <div w-class="reportdynamicUser">
            {{for i,v of it.reportInfoList}}
                <div w-class="userItem">
                    {{for j,t of v}}
                    <div style="width: 245px;">{{t.key}}:&nbsp;&nbsp;{{t.value}}
                        {{if t.fg ||t.fg==0}}
                            {{if t.fg!=2}}
                                <img src="../../../res/images/{{t.fg===1?'girl.png':'boy.png'}}" w-class="sexImg"/>
                            {{else}}
                                <img src="../../../res/images/neutral.png" w-class="sexImg"/>
                            {{end}}
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
                                        <img src="{{t}}" alt="" w-class="imgInfo" on-tap="bigImg('{{t}}')"/>
                                    {{end}}
                                </div>
                            {{end}}
                        {{elseif i==3}}
                            <div style="display:flex;width:100%;">
                                <div>{{v.key}}:</div>
                                <div w-class="reportUserInfo">
                                    {{for j,t of v.value}}
                                        <div>{{t.key}}:&nbsp;&nbsp;{{t.value}}
                                            {{if t.fg || t.fg==0 }}
                                                {{if t.fg!=2}}
                                                    <img src="../../../res/images/{{t.fg===1?'girl.png':'boy.png'}}" w-class="sexImg"/>
                                                {{else}}
                                                    <img src="../../../res/images/neutral.png" w-class="sexImg"/>
                                                {{end}}
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