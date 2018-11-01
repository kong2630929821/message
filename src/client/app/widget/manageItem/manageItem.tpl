<div style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
    <ul w-class="manage-ul">
        {{for index,item of it.manageList}}
        <li w-class="manage-item-wrap">
            <span w-class="title">{{item.title}}</span>
            {{if item.quantity}}
            <span w-class="quantity">{{item.quantity}}</span>
            {{end}}
            <img w-class="goToImg" src="../../res/images/send.png" />
        </li>
        {{end}}
    </ul>
</div>