<div>
    <app-publicComponents-blankDiv-topDiv></app-publicComponents-blankDiv-topDiv>
    <div w-class="topBar">
        {{if it.leftImg}}
        <img src="../../res/images/{{it.leftImg}}" w-class="back" on-tap="goBack"/>
        {{end}}

        {{if it.leftText}}
        <div w-class="createGroup" on-tap="goBack">{{it.leftText}}</div>
        {{end}}

        <div w-class="pageTitle">{{it.title}}</div>

        {{if it.rightText}}
        <div w-class="createGroup" style="color:{{it.style?it.style:'black'}}" on-tap="next">{{it.rightText}}</div>
        {{else}}
        <div w-class="createGroup" style="color:{{it.style?it.style:'black'}}" on-tap="next">{{it.rightText}}</div>
        {{end}}

        {{if it.rightImg}}
        <img src="../../res/images/{{it.rightImg}}" w-class="back" on-tap="next"/>
        {{end}}
    </div>
</div>