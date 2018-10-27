<div style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
    <ul w-class="util-list-wrap">
        {{for index, item of it.utilList}}
            <li w-class="liItem" style="height:80px;background:white;">
                {{if item.iconPath}}
                    <img w-class="utilImg" src="../../../res/images/{{item.iconPath}}" />
                {{end}}
                <span w-class="utilText">{{item.utilText}}</span>
            </li>
        {{end}}
    </ul>
</div>