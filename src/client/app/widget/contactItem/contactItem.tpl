<div w-class="contact-item-wrap">
    <div w-class="contact-wrap">
        <div w-class="avator-wrap">
            <img w-class="avator" src="../../res/images/user.png" />
        </div>
        <span w-class="text">{{(it.text ? it.text : it.uid || it.info) || it.ginfo.name}}</span>
        {{if it.totalNew>0}}
        <div w-class="other">
            {{it.totalNew}}
        </div>
        {{end}}
    </div>
</div>
        