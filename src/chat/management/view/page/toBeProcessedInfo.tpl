<div w-class="page">
    <div w-class="cancle" on-tap="exit">返回上一页</div>
    {{if it.state===3||it.state==4||it.state==5}}
    <div w-class="deelArtice">
        <div w-class="titleObj">
            <div style="line-height: 40px;margin-left: 20px;">举报对象</div>
            <div w-class="deel" on-tap="deelClick" on-down="onShow">{{it.deelObjName}}</div>
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
            <div w-class="content">
                <widget w-tag="pi-ui-html">{{it.dynamic.msg}}</widget>
            </div>
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
            <div w-class="deel" on-tap="deelClick" on-down="onShow">{{it.deelObjName}}</div>
        </div>
        <div w-class="ObjInfo">
            {{for i,v of it.state==1?it.userName:it.haiHaiName}}
                <div w-class="item">
                    {{v.key}}：{{v.value}}
                    {{if it.state==1}}
                        {{if v.sex}}
                        <img src="{{v.sex}}" alt="" w-class="sexImg"/>
                        {{end}}
                    {{else}}
                        {{if v.fg}}
                            <div w-class="haihaiName">嗨嗨号</div>
                        {{end}}
                    {{end}}
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
            {{for i,v of it.deelObj}}
                <div w-class="reportItem">
                    {{if i==0}}
                        <div>{{v.key}}：{{v.value.length?'':'无'}}</div>
                        {{if v.value.length}}
                            <div w-class="imgGroup">
                                {{for j,t of v.value}}
                                    <img src="{{t}}" alt="" w-class="imgInfo"/>
                                {{end}}
                            </div>
                        {{end}}
                    {{else}}
                        <div>{{v.key}}：{{v.value}}</div>
                    {{end}}
                </div>
            {{end}}
        </div>
    </div>
    {{end}}

    {{if it.state===4}}
    <div w-class="titleBox" style="margin-bottom:20px">
        <div w-class="titleObj">
            <div style="line-height: 40px;margin-left: 20px;">关联嗨嗨号</div>
            <div w-class="deel"  on-tap="deelClickHaiHai" on-down="onShow">处理嗨嗨号</div>
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
            <div w-class="deel" on-tap="deelClickUser" on-down="onShow">处理用户</div>
        </div>
        <div w-class="ObjInfo">
            {{for i,v of it.userName}}
                <div w-class="item">
                    {{v.key}}：{{v.value}}
                    {{if v.fg}}
                    <img src="{{v.fg}}" alt="" w-class="sexImg"/>
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
                    {{if v.fg}}
                    <img src="{{v.fg}}" alt="" w-class="sexImg"/>
                    {{end}}
                </div>
            {{end}}
        </div>
    </div>
    <div w-class="btn" on-tap="invalid" on-down="onShow">投诉不成立</div>
</div>