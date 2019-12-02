<div w-class="reportBox">
    <div w-class="body">
        <div w-class="reportTitle">
            <div>{{it.title}}</div>
            <div w-class="userInfo">
                <img src="{{it.avatar?v.avatar:'../res/images/avatar1.png'}}" alt="" w-class="avatar"/>
                <div w-class="userName">{{it.name}}</div>
            </div>
        </div>
        <div w-class="checkType">
            {{for i,v of it.checkTypeList}}
            <div w-class="row1" on-tap="btnCheckType({{i}})" on-down="onShow">
                <img src="../res/images/{{it.checkedType==i?'selectBox_active.png':'selectBox.png'}}" w-class="rowImg"/>
                <div w-class="rowItem">{{v}}</div>
            </div>
            {{end}}
        </div>
        
        <div w-class="typeList" style="{{it.checkedType?'border:1px solid rgba(204,204,204,1);':''}}">
            {{if it.checkedType}}
            <div w-class="checkBox">
                {{for i,v of it.reason}}
                    <div w-class="row1" on-tap="btnCheck({{i}})" on-down="onShow">
                        <img src="../res/images/{{it.currentReason==i?'selectBox_active.png':'selectBox.png'}}" w-class="rowImg"/>
                        <div w-class="rowItem">{{v}}</div>
                    </div>
                {{end}}
            </div>
            {{end}}
        </div>
       
        <div w-class="sendNotice">处理结果将通过客服通知用户</div>
        <div w-class="checkType" style="justify-content: space-between;align-items: center;">
            <div style=" margin-left: 20px;line-height: 55px;">客服回复</div>
        </div>
        <div w-class="typeList">
            <div style="margin-left:20px;">{{it.msg}}</div>
        </div>
        <div w-class="btnGroup">
            <div w-class="btn" on-tap="cancleBtn" on-down="onShow">取消</div>
            <div w-class="btn" on-tap="okBtn" on-down="onShow">确认处理</div>
        </div>
    </div>
</div>