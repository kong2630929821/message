<div style="height: 100%;">
    {{if it.announce && !it.announce.cancel}}
    <div w-class="latest-announce-wrap">
        <img src="../../res/images/sound.png" style="margin-left: 30px;margin-right: 15px;"/>
        <div w-class="content-wrap">{{it.announce.msg}}</div>
        {{if it.isOwner}}
        <img src="../../res/images/close_blue.png" on-tap="recallLatestAnnounce" style="margin-right: 30px;"/>
        {{end}}
    </div>
    {{end}}
</div>