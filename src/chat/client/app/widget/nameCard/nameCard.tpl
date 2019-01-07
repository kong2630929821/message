<div>
    <div w-class="name-info-wrap {{it.cardType=='redEnv'?'redEnvTop':''}}">
        {{if it.cardType == "redEnv"}}
        <img w-class="redEnvImg" src="../../res/images/redEnvelope.png" />
        {{else}}
        <img w-class="avatar-wrap" src="{{it.avatorPath}}" />
        {{end}}
        <span w-class="name-card-info" style="color:{{it.cardType=='redEnv'?'#fff':'#222'}}">{{it.cardInfo}}</span>
    </div>
    <div w-class="cardType">{{it.cardTypeShow}}</div>
</div>