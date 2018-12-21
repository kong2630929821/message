<div>
    {{if it.show}}
    <div w-class="contact-wrap">
        <div w-class="avatar-wrap">
            <img w-class="avatar" src="../../res/images/user.png" />
        </div>
        <span w-class="text">{{it.text ? it.text : it.name}}</span>
        {{if it.totalNew>0}}
        <div w-class="other">
            {{it.totalNew}}
        </div>
        {{end}}
    </div>
    {{end}}
</div>
        