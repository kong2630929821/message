<div w-class="addAppBox">
    <div w-class="body">
        <div w-class="name">{{it.title}}</div>
        <div w-class="search">
            <div w-class="input" ev-input-change="inputChange">
                <widget w-tag="chat-management-components-input">{itype:"text",placeHolder:"第三方名称/应用ID"}</widget>
                <img src="../res/images/search-gray.png" alt="" w-class="searchIcon"/>
            </div>
            <div w-class="searchBtn" on-down="onShow" on-tap="search">搜索</div>
        </div>

        {{if it.appItem.appid}}
        <div w-class="searchItem" on-tap="check" on-down="onShow">
            <div w-class="iconBox">
                <img src="{{it.buildupImgPath(it.appItem.img[0])}}" alt="" w-class="itemIcon"/>
                <div w-class="info">
                    <div w-class="infoName">{{it.appItem.title}}</div>
                    <div w-class="infoDesc">{{it.appItem.subtitle}}</div>
                </div>
            </div>
            <div w-class="checkBox">
                <div w-class="id">ID：{{it.appItem.appid}}</div>
                <img src="../res/images/{{it.checked?'icon_right2.png':'icon_right.png'}}" alt="" w-class="checkIcon"/>
            </div>
        </div>
        {{end}}

        <div w-class="btnGroup">
            <div w-class="searchBtn" on-tap="exitBtn" on-down="onShow">取消</div>
            <div w-class="searchBtn" style="margin-left: 30px;" on-tap="okBtn" on-down="onShow">确认</div>
        </div>
    </div>
</div>