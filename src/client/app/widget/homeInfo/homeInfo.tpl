<div style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
    <div w-class="home-info-wrap">
        <div w-class="avator-wrap">
            <img w-class="avator" src="../../res/images/{{it.avatorPath}}" />
        </div>
        <span w-class="nameText">{{it.name}}</span>
        {{if it.note}}
            <span w-class="otherText">{{it.isUser ? "备注：" : "群号："}}{{it.note}}</span>
        {{end}}
    </div>
</div>