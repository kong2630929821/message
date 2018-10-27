<div style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
    <div w-class="img-message-wrap">
        <div w-class="img-wrap">
            <img w-class="img-message" id="imgMessage" src="../../../res/images/{{it.imgPath}}" />
        </div>
        <div w-class="corner">
            <span w-class="sendTime">{{it.sendTime}}</span>
            {{if it.isRead}}
            <img w-class="isRead" src="../../../res/images/error.png" />
            {{end}}
        </div>
    </div>
</div>