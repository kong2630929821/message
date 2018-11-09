<div style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
        <ul w-class="group-set-ul">
            {{for index,item of it.groupSetList}}
            <li w-class="groupSet-item-wrap">
                <div w-class="itemText-wrap">
                    <span w-class="title">{{item.title}}</span>
                    <span w-class="content">{{item.content}}</span>
                </div>
                <div w-class="switch"></div>
            </li>
            {{end}}
        </ul>
    </div>