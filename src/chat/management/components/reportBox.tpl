<div w-class="reportBox">
    <div w-class="body">
        <div w-class="reportTitle">
            <div>好嗨ID：1233213</div>
            <div style="margin-left:40px">
                用户名称：打算打打死
                <img src="../../client/app/res/images/girl.png" alt="" w-class="sexImg"/>
            </div>
        </div>
        <div w-class="checkType">
            {{for i,v of it.checkType}}
            <div w-class="row1" on-tap="btnCheckType({{i}})" on-down="onShow">
                <img src="../res/images/{{it.checkedList==i?'selectBox_active.png':'selectBox.png'}}" w-class="rowImg"/>
                <div w-class="rowItem">{{v}}</div>
            </div>
            {{end}}
        </div>
        <div w-class="typeList">
            <div style="margin-left:20px">选择处罚时长</div>
            <div w-class="checkBox">
                {{for i,v of it.checkTime}}
                    <div w-class="row1" on-tap="btnCheckTime({{i}})" on-down="onShow">
                        <img src="../res/images/{{it.checkTimeList==i?'selectBox_active.png':'selectBox.png'}}" w-class="rowImg"/>
                        <div w-class="rowItem">{{v}}</div>
                    </div>
                {{end}}
            </div>
        </div>
        <div w-class="sendNotice">发送处罚通知</div>
        <div w-class="checkType" style="justify-content: space-between;align-items: center;">
            <div style=" margin-left: 20px;line-height: 55px;">危险操作</div>
            <div w-class="btn" style="margin-right:20px"  on-down="onShow">删除嗨嗨号</div>
        </div>
        <div w-class="typeList">
            <div style="margin-left:20px;">冻结用户</div>
            <div style="margin-left:20px;">对方将不能进行发社交动态、聊天、挖矿等操作，只能进行钱包交易及游戏，请谨慎操作</div>
        </div>
        <div w-class="btnGroup">
            <div w-class="btn" on-tap="btnCancel" on-down="onShow">取消</div>
            <div w-class="btn" on-tap="btnOk" on-down="onShow">确认处理</div>
        </div>
    </div>
</div>