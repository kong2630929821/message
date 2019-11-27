<div w-class="page">
    <div w-class="goBack(false,e)">返回上一页</div>
    <div w-class="userInfoBox">
        <div w-class="userInfoTitle">用户信息</div>
        <div w-class="userInfo">
            <img src="../../../res/images/xianzhixiadao.png" alt="" w-class="avatar"/>
            <div w-class="infoBox">
                <div w-class="row">
                    <div w-class="rowItem">好嗨ID：2333333</div>
                    <div w-class="rowItem">
                        <div>玩家昵称：用户昵称最长只有十二个字</div>
                        <img src="../../../res/images/boy.png" alt="" w-class="mark"/>
                        <img src="../../../res/images/official.png" alt="" w-class="mark"/>
                        <div w-class="cancelOfficial">取消官方认证</div>
                    </div>
                    <div w-class="rowItem">
                        <div>第三方应用：一代掌门</div>
                        <div w-class="btn">修改绑定关系</div>
                    </div>
                </div>
                <div w-class="row" style="justify-content: space-between;">
                    {{for i,v of [1,2,3,4,5,6,7]}}
                        <div w-class="rowItem">好嗨ID：2333333</div>
                    {{end}}
                </div>
                <div w-class="row">
                    <div w-class="rowItem">
                        <div>累计惩罚：禁止发言7天（剩余3天）、禁止发动态24小时（剩余1小时）</div>
                        <div w-class="btn">解除惩罚</div>
                        <div w-class="btn">处理玩家</div>
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
</div>