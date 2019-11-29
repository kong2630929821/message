<div w-class="page">
    <div w-class="cusInput">

        <div>ID：{{it.id}}</div>

        <div w-class="passwordBox">
            <div style="margin-right:10px;">密码</div>
            <div w-class="input" ev-input-change="inputChangePass" style="margin-right:10px;{{it.isChange==0?'':'border:1px solid rgba(24,134,217,1);'}}">
                <widget w-tag="chat-management-components-input">{itype:"password",placeHolder:"输入登录密码",input:{{it.password}},disabled:{{it.isChange==0?'true':''}} }</widget>
            </div>
        </div>

        <div w-class="btnGroup">
            {{if it.isChange==0}}
                <div w-class="btn" on-tap="changePassWord" on-down="onShow">修改密码</div>
            {{else}}
                <div w-class="btn" on-down="onShow" on-tap="cancelChange">取消修改</div>
                <div w-class="btn" on-down="onShow" on-tap="saveChange">保存修改</div>
            {{end}}
        </div>
    </div>
</div>