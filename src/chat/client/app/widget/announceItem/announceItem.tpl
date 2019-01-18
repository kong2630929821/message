<div>
    {{if it.announce && !it.announce.cancel}}
    <div w-class="item-wrap">
        <div w-class="title">{{it.noticeTitle}}</div>
        <div w-class="time">{{it.time}}</div>
    </div>
    {{end}}
</div>