<div w-class="applicationItem">
    <img src="{{it.buildupImgPath(it.item.img[0])}}" alt="" w-class="appIcon"/>
    <div w-class="appInfo">
        <div w-class="appName">{{it.item.title}}</div>
        <div w-class="appDesc">{{it.item.subtitle}}</div>
        <div w-class="appId">
            <div w-class="idItem">客服ID：{{it.item.accId}}</div>
            <div w-class="idItem">应用ID：{{it.item.appid}}</div>
            <div>添加时间：{{it.item.time}}</div>
        </div>
    </div>
</div>