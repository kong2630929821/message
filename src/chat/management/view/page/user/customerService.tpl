<div w-class="page">
    <div w-class="tabar">
        <div w-class="tab {{it.active==0?'activeTab':''}}" on-tap="changeTab(0)" on-down="onShow">好嗨客服设置</div>
        <div style="margin-left: 30px;" w-class="tab {{it.active==1?'activeTab':''}}" on-tap="changeTab(1)" on-down="onShow">回复内容设置</div>
    </div>

    {{if it.active==0}}
        <div w-class="cusInput">
            <div w-class="input" ev-input-change="inputChangeId" style="margin-right:20px;{{it.isHaveCus==1 && it.isHaveCus!==0?'':'border:1px solid rgba(24,134,217,1);'}}">
                <widget w-tag="chat-management-components-input">{itype:"number",placeHolder:"输入好嗨ID",input:{{it.haohaiId}},disabled:{{it.isHaveCus==1 && it.isHaveCus!==0?'true':''}} }</widget>
            </div>
            <div w-class="input" ev-input-change="inputChangePass" style="margin-right:10px;{{it.isHaveCus==1 && it.isHaveCus!==0?'':'border:1px solid rgba(24,134,217,1);'}}">
                <widget w-tag="chat-management-components-input">{itype:"password",placeHolder:"输入登录密码",input:{{it.haoHaiPass}},disabled:{{it.isHaveCus==1 && it.isHaveCus!==0?'true':''}} }</widget>
            </div>

            <div w-class="btnGroup">
                {{if it.isHaveCus==0}}
                    <div w-class="btn" on-tap="isHaveCusChange(0)" on-down="onShow">添加好嗨客服</div>
                {{elseif it.isHaveCus==1}}
                    <div w-class="btn" on-down="onShow" on-tap="isHaveCusChange(1)">修改好嗨客服</div>
                {{else}}
                    <div w-class="btn" on-down="onShow" on-tap="cancelChange(0)">取消修改</div>
                    <div w-class="btn" on-down="onShow" on-tap="saveChange(0)">保存修改</div>
                {{end}}
            </div>
        </div>
    {{else}}
       <div>
            <div w-class="title">新用户自动回复内容：</div>
            <div w-class="newUserInput" ev-input-change="userChange" style="{{it.userStatus?'':'border:1px solid rgba(24,134,217,1);'}}">
                <widget w-tag="chat-management-components-textarea">{placeHolder:"内容", style:"max-height:none;min-height:157px;font-size:16px;line-height:20px", input:{{it.newUserInput}},disabled:{{it.userStatus?it.userStatus:''}} }</widget>
            </div>
            <div w-class="btnGroup" style="margin-top:20px;width:625px;">
                {{if it.userStatus}}
                    <div w-class="btn" on-tap="onChange(0)" on-down="onShow">修改</div>
                {{else}}
                    <div w-class="btn" on-down="onShow" on-tap="cancelChange(1)">取消修改</div>
                    <div w-class="btn" on-down="onShow" on-tap="saveChange(1)">保存修改</div>
                {{end}}
            </div>
       </div>
       <div>
            <div w-class="title">举报回复内容：</div>
            <div w-class="newUserInput" ev-input-change="reportChange" style="{{it.reportStatus?'':'border:1px solid rgba(24,134,217,1);'}}">
                <widget w-tag="chat-management-components-textarea">{placeHolder:"内容", style:"max-height:none;min-height:157px;font-size:16px;line-height:20px", input:{{it.reportInput}},disabled:{{it.reportStatus?it.reportStatus:''}} }</widget>
            </div>
            <div w-class="btnGroup" style="margin-top:20px;width:625px;">
                {{if it.reportStatus}}
                    <div w-class="btn" on-tap="onChange(1)" on-down="onShow">修改</div>
                {{else}}
                    <div w-class="btn" on-down="onShow" on-tap="cancelChange(2)">取消修改</div>
                    <div w-class="btn" on-down="onShow" on-tap="saveChange(2)">保存修改</div>
                {{end}}
            </div>
       </div>
    {{end}}
</div>