<div w-class="page">
    <div w-class="cusInput">
        <div w-class="input" ev-input-change="inputChangePass" style="margin-right:10px;{{it.isChange==1 && it.isChange!==0?'':'border:1px solid rgba(24,134,217,1);'}}">
            <widget w-tag="chat-management-components-input">{itype:"text",placeHolder:"输入登录密码",input:{{it.password}},disabled:{{it.isChange==1 && it.isChange!==0?'true':''}} }</widget>
        </div>

        <div w-class="btnGroup">
            {{if it.isChange==0}}
                <div w-class="btn" on-tap="isHaveCusChange(0)" on-down="onShow">修改密码</div>
            {{else}}
                <div w-class="btn" on-down="onShow" on-tap="cancelChange(0)">取消修改</div>
                <div w-class="btn" on-down="onShow" on-tap="saveChange(0)">保存修改</div>
            {{end}}
        </div>
    </div>
</div>