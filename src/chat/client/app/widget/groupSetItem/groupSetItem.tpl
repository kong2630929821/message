<ul w-class="group-set-ul">
    {{for index,item of it.groupSetList}}
    <li w-class="groupSet-item-wrap">
        <div w-class="itemText-wrap">
            <span w-class="title">{{item.title}}</span>
            <span w-class="content">{{item.content}}</span>
        </div>
        <div w-class="switch">
            <chat-client-app-widget-switch-switch>{types:true,activeColor:"linear-gradient(to right,#318DE6,#38CFE7)",inactiveColor:"#dddddd"}</chat-client-app-widget-switch-switch>
        </div>
    </li>
    {{end}}
</ul>