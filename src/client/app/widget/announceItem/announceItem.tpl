<div>
    {{if it.announce && !it.announce.cancel}}
    <div w-class="item-wrap">
        <div w-class="title">{{it.announce?it.announce.msg:""}}</div>
        <div w-class="time">{{it.time}}</div>
    </div>
    {{end}}
</div>