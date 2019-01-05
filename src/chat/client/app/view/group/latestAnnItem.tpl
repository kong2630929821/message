<div style="height: 100%;">
    {{if it.announce && !it.announce.cancel}}
    <div w-class="latest-announce-wrap">
        <img src="../../res/images/sound.png" style="margin-left: 30px;margin-right: 15px;"/>
        <div w-class="content-wrap">{{it.announce.msg}}</div>
        <img src="../../res/images/close_blue.png" on-tap="closeAnnounce" style="margin-right: 30px;"/>
    </div>
    {{end}}
</div>