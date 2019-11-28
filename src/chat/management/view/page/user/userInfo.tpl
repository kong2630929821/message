<div w-class="page">
    {{if !it.status}}
    <div w-class="goBack" on-tap="goBack(false,e)">返回上一页</div>
    <div w-class="userInfoBox">
        <div w-class="userInfoTitle">用户信息</div>
        <div w-class="userInfo">
            <img src="{{it.buildupImgPath(it.userInfo.avatar)}}" alt="" w-class="avatar"/>
            <div w-class="infoBox">
                <div w-class="row">
                    <div w-class="rowItem">好嗨ID：{{it.userInfo.acc_id}}</div>
                    <div w-class="rowItem">
                        <div>玩家昵称：{{it.userInfo.name}}</div>
                        {{if it.userInfo.sex==2}}
                            <img src="../../../res/images/neutral.png" alt="" w-class="mark"/>
                        {{else}}
                            <img src="../../../res/images/{{it.userInfo.sex==1?'girl.png':'boy.png'}}" alt="" w-class="mark"/>
                        {{end}}

                        {{if it.official}}
                            <img src="../../../res/images/official.png" alt="" w-class="mark"/>
                            <div w-class="cancelOfficial" on-tap="cancelOfficial" on-down="onShow">取消官方认证</div>
                        {{else}}
                            <div w-class="cancelOfficial" on-tap="setOfficial" on-down="onShow">设为官方</div>
                        {{end}}
                    </div>
                    {{if it.official}}
                    <div w-class="rowItem">
                        <div>第三方应用：{{it.official}}</div>
                        <div w-class="btn">修改绑定关系</div>
                    </div>
                    {{end}}
                </div>
                <div w-class="row" style="justify-content: space-between;">
                    <div w-class="rowItem">关联手机号码：{{it.userInfo.tel?it.userInfo.tel:'无'}}</div>
                    <div w-class="rowItem">粉丝：{{it.userInfo.fans}}</div>
                    <div w-class="rowItem">关注数：{{it.userInfo.attention}}</div>
                    <div w-class="rowItem">{{it.official?'文章':'动态'}}：{{it.userInfo.post}}</div>
                    <div w-class="rowItem">被举报次数总计：{{it.userInfo.reported}}</div>
                    <div w-class="rowItem">被处罚次数总计：{{it.userInfo.punish}}</div>
                    <div w-class="rowItem">举报次数总计：{{it.userInfo.report}}</div>
                </div>
                <div w-class="row">
                    <div w-class="rowItem">
                        <div>当前惩罚：{{it.userInfo.nowPublish?it.userInfo.nowPublish:'无'}}</div>
                        {{if it.userInfo.nowPublish != '' }}
                            <div w-class="btn">解除惩罚</div>
                            <div w-class="btn">处理玩家</div>
                        {{end}}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div ev-table-detail="goDetail" style="margin-top:37px;">
        <div w-class="tableTitle">数据列表</div>
        <widget w-tag="chat-management-components-table" style="max-height:550px;">{datas: {{it.showDataList}},title:{{it.showTitleList}},needCheckBox:false,inlineBtn2:"查看详情"}</widget>
    </div>
    <div w-class="ctroller">
        <div ev-changeCurrent="pageChange" w-class="pagination" ev-perPage="perPage" ev-expand="expand">
            <widget w-tag="chat-management-components-pagination">{pages:{{Math.ceil(it.sum/ it.perPage)}},filterShow:true,currentIndex:{{it.currentIndex}},expand:{{it.expandIndex}},numberCheckActiveIndex:{{it.perPageIndex}} }</widget>
        </div>
    </div>
    {{else}}
    <div style="height:100%" ev-exit="exit(false,e)" ev-ok="exit(true,e)">
        <widget w-tag="chat-management-view-page-complaint-toBeProcessedInfo">{data:{{it.reportId}},state:{{it.reportType}},returnDeel:1 }</widget>
    </div>
    {{end}}
</div>