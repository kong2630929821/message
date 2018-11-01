<div w-class="register-wrap" style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
    <client-app-widget-topBar-topBar w-class="title">{title:"注册",background:"none"}</client-app-widget-topBar-topBar>
    <div w-class="avator-wrap">
        <div w-class="user-avator">
            <img w-class="avator" src="../../res/images/user.png" />
        </div>
        <span w-class="upload" on-tap="upload">上传头像</span>
    </div>
    <div w-class="input-wrap">
        <div style="position:relative;" ev-input-change="inputName">
            <client-app-widget-input-input w-class="pi-input idInput">{placeHolder : "昵称",style : "font-size:32px;color:#318DE6"}</client-app-widget-input-input>
            <div w-class="random-name" on-tap="randomName">
                <img src="../../res/images/random.png" />
            </div>
        </div>
        <div style="position:relative;" ev-psw-change="inputPasswd">
            <client-app-widget-password-password>{type:{{it.pwVisible ? "text" : "password"}},hideTips:true}</client-app-widget-password-password>
            <div w-class="pwd-eye" on-tap="changepwEye">
                <img src="../../res/images/{{it.pwVisible ? 'open' : 'close'}}-eye.png" />
            </div>
        </div>
        <div style="position:relative;" ev-input-change="repeatPasswd">
            <client-app-widget-input-input w-class="pi-input">{placeHolder : "重复密码",isSuccess:{{it.isSuccess}},itype :{{it.repwVisible ? "text" : "password"}},clearable : true,style : "font-size:32px;color:#318DE6" }</client-app-widget-input-input>
            <div w-class="repwd-eye" on-tap="changerepwEye">
                <img src="../../res/images/{{it.repwVisible ? 'open' : 'close'}}-eye.png" />
            </div>
        </div>
    </div>
    <span w-class="register-btn" on-tap="register">注册</span>
</div>