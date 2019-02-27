<ul w-class="manage-ul">
    {{for index,item of it.manageList}}
    <li w-class="manage-item-wrap" on-tap="openManageItem(e,{{index}})" on-down="onShow">
        <span w-class="title">{{item.title}}</span>
        {{if item.quantity}}
        <span w-class="quantity">{{item.quantity}}</span>
        {{end}}
        <img w-class="goToImg" src="../../res/images/more-gray.png" />
    </li>
    {{end}}
</ul>