<div w-class="page">
    <div w-class="goBack" on-tap="goBack(false,e)">返回上一页</div>
    <div w-class="userInfoBox">
        <div w-class="userInfoTitle">
            <div>认证信息</div>
            <div w-class="btnGroup">
                <div w-class="btn" on-tap="certified(false)" on-down="onShow">驳回</div>
                <div w-class="btn" style="margin-left:10px;" on-tap="certified(true)" on-down="onShow">通过认证</div>
            </div>
        </div>
        <div w-class="userInfo">
            <img src="{{it.buildupImgPath(it.userInfo.avatar)}}" alt="" w-class="avatar"/>
            <div w-class="infoBox">
                <div w-class="row" style="height:63px;font-weight: 600;">
                    <div w-class="rowItem">
                        <div>用户昵称：{{it.userInfo.name}}</div>
                        {{if it.userInfo.sex==2}}
                            <img src="../../../res/images/neutral.png" alt="" w-class="sex"/>
                        {{else}}
                            <img src="../../../res/images/{{it.userInfo.sex==1?'girl.png':'boy.png'}}" alt="" w-class="sex"/>
                        {{end}}
                    </div>
                    <div w-class="rowItem">好嗨ID：{{it.userInfo.acc_id}}</div>
                    <div w-class="rowItem">手机号：{{it.userInfo.tel?it.userInfo.tel:'无'}}</div>
                    <div w-class="rowItem">申请时间：{{it.userInfo.time}}</div>
                </div>
                <div w-class="row">{{it.userInfo.note?it.userInfo.note:'无'}}</div>
            </div>
        </div>
    </div>

    {{if it.dataList.length}}
    <div ev-table-detail="goDetail" style="margin-top:37px;">
        <div w-class="tableTitle">申请记录</div>
        <widget w-tag="chat-management-components-table" style="max-height:550px;">{datas: {{it.showDataList}},title:{{it.showTitleList}},needCheckBox:false}</widget>
    </div>
    <div w-class="ctroller">
        <div ev-changeCurrent="pageChange" w-class="pagination" ev-perPage="perPage" ev-expand="expand">
            <widget w-tag="chat-management-components-pagination">{pages:{{Math.ceil(it.sum/ it.perPage)}},filterShow:true,currentIndex:{{it.currentIndex}},expand:{{it.expandIndex}},numberCheckActiveIndex:{{it.perPageIndex}} }</widget>
        </div>
    </div>
    {{end}}
</div>