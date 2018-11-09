<div w-class="contact-item-wrap" on-tap="transferAdmin" on-tap="toNewFriend" on-tap="toContactorInfo">
    <div w-class="contact-wrap">
        <div w-class="avator-wrap">
            <img w-class="avator" src="../../res/images/{{it.avatorPath}}" />
        </div>
        <span w-class="text">{{it.text}}</span>
        {{if it.totalNew > 0}}
        <div w-class="other">
            {{it.totalNew}}
        </div>
        {{end}}
    </div>
</div>
        