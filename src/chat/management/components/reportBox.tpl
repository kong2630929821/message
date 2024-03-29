<div w-class="reportBox">
    <div w-class="body">
        <div w-class="reportTitle">
            <div>{{it.state==0?'好嗨ID':'嗨嗨号ID'}}：{{it.userInfo.id}}</div>
            <div style="margin-left:40px; display: flex;">
                {{it.state==0?'用户昵称':'嗨嗨号昵称'}}：{{it.userInfo.name}}
 
                {{if it.userInfo.sex!=2}}
                    <img src="../res/images/{{it.userInfo.sex===1?'girl.png':'boy.png'}}" w-class="sexImg"/>
                {{else}}
                    <img src="../res/images/neutral.png" w-class="sexImg"/>
                {{end}}

                {{if it.userInfo.isPublic}}
                    <div w-class="haihaiName">嗨嗨号</div>
                {{end}}
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
            <div style=" margin-left: 20px;line-height: 55px;">客服回复</div>
        </div>
        <div w-class="typeList">
            <div style="margin-left:20px;">{{it.msg}}</div>
        </div>
        <div w-class="btnGroup">
            <div w-class="btn" on-tap="btnCancel" on-down="onShow">取消</div>
            <div w-class="btn" on-tap="btnOk" on-down="onShow">确认处理</div>
        </div>
    </div>
</div>