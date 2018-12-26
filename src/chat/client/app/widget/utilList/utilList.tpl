<ul w-class="util-list-wrap">
    {{for index, item of it.utilList}}
        <li w-class="liItem" on-tap="handleUtilItemTap(e,{{index}})">
            {{if item.iconPath}}
                <img w-class="utilImg" src="../../res/images/{{item.iconPath}}" />
            {{end}}
            <span w-class="utilText">{{item.utilText}}</span>
        </li>
    {{end}}    
</ul>