<div w-class="page">
    <div w-class="cancle" on-tap="exit">返回上一页</div>
    {{if it.state===3||it.state==5}}
    <div w-class="deelArtice">
        <div w-class="titleObj">
            <div style="line-height: 40px;margin-left: 20px;">举报对象</div>
            <div w-class="deel" on-tap="deelClick">{{it.deelObjName}}</div>
        </div>
        <div w-class="deelArticeTitle">
            {{for i,v of it.deelObj}}
            <div w-class="item">
                {{v.key}}：{{v.value}}
            </div>
            {{end}}
        </div>
        <div w-class="contentInfo">
            <div w-class="contentTitle">{{it.dynamic.title}}</div>
            <div w-class="timeInfo">
                <div>提交时间：{{it.dynamic.time}}</div>
                <div style="margin-left: 58px;">
                    <span>赞 {{it.likeCount}}</span>
                    <span style="margin-left:20px">评论 {{it.reply}}</span>
                </div>
            </div>
            <div w-class="content">{{it.dynamic.msg}}</div>
            {{if it.dynamic.imgs.length}}
                {{for i,v of it.dynamic.imgs}}
                    <img src="{{v}}" alt="" w-class="imgBig"/>
                {{end}}
            {{end}}
        </div>
    </div>
    {{end}}

    {{if it.state==1 ||it.state==2}}
    <div w-class="titleBox">
        <div w-class="titleObj">
            <div style="line-height: 40px;margin-left: 20px;">举报对象</div>
            <div w-class="deel">处理</div>
        </div>
        <div w-class="ObjInfo">
            {{for i,v of [1,1,1,1,1,1,1]}}
                <div w-class="item">
                    用户昵称：用户昵称最长只有十二个字<img src="../../../client/app/res/images/girl.png" alt="" w-class="sexImg"/>
                </div>
            {{end}}
        </div>
    </div>
    {{end}}

    {{if it.state==1 ||it.state==2}}
    <div w-class="reportInfo">
        <div w-class="titleObj">
            <div style="line-height: 40px;margin-left: 20px;">举报信息</div>
        </div>
        <div w-class="reportImg">
            <div w-class="reportItem">
                <div>上传截图：</div>
                <div w-class="imgGroup">
                    {{for i,v of [1,2,3]}}
                        <img src="1.jpg" alt="" w-class="imgInfo"/>
                    {{end}}
                </div>
            </div>
            <div w-class="reportItem">
                <div>举报原因：人身攻击</div>
            </div>
            <div w-class="reportItem">
                <div>举报描述：无</div>
            </div>
        </div>
    </div>
    {{end}}

    {{if it.state===4}}
    <div w-class="titleBox" style="margin-bottom:20px">
        <div w-class="titleObj">
            <div style="line-height: 40px;margin-left: 20px;">关联嗨嗨号</div>
            <div w-class="deel">处理嗨嗨号</div>
        </div>
        <div w-class="ObjInfo">
            {{for i,v of it.haiHaiName}}
                <div w-class="item">
                    {{v.key}}：{{v.value}}
                    {{if v.fg}}
                        <div w-class="haihaiName">嗨嗨号</div>
                    {{end}}
                </div>
            {{end}}
        </div>
    </div>
    {{end}}

    {{if it.state!==1}}
    <div w-class="titleBox" style="margin-bottom:20px">
        <div w-class="titleObj">
            <div style="line-height: 40px;margin-left: 20px;">关联用户</div>
            <div w-class="deel">处理用户</div>
        </div>
        <div w-class="ObjInfo">
            {{for i,v of it.userName}}
                <div w-class="item">
                    {{v.key}}：{{v.value}}
                    {{if v.sex}}
                    <img src="{{v.sex}}" alt="" w-class="sexImg"/>
                    {{end}}
                </div>
            {{end}}
        </div>
    </div>
    {{end}}
    <div w-class="titleBox">
        <div w-class="titleObj">
            <div style="line-height: 40px;margin-left: 20px;">举报人</div>
        </div>
        <div w-class="ObjInfo">
            {{for i,v of it.reporterName}}
                <div w-class="item">
                    {{v.key}}：{{v.value}}
                    {{if v.sex}}
                    <img src="{{v.sex}}" alt="" w-class="sexImg"/>
                    {{end}}
                </div>
            {{end}}
        </div>
    </div>
    <div w-class="btn">投诉不成立</div>
</div>