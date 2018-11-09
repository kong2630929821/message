<div w-class="user-apply-wrap">
    <div w-class="avator-wrap">
        <img w-class="avator" src="../../res/images/{{it.avatorPath}}" />
    </div>
     <div w-class="user-info-wrap">
        <span w-class="userName">{{it.userName}}</span>
         <span w-class="applyInfo">{{it.applyInfo}}</span>
    </div>
    <span w-class="seeText" on-tap="viewApplyDetail({{it.uid}})">查看</span>
</div>