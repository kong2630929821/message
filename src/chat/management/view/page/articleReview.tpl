<div w-class="page" on-tap="close">
    <div w-class="articleList">
        <div w-class="leftBox">
            {{for i ,v of [1,2,3,3,3,3,3,1,2,3,3,3]}}
                <div w-class="listItem">
                    <div w-class="titleBox">
                        <div w-class="title">光荣公布Gust新作《妖精的尾巴》 预计2020年发售</div>
                        <div w-class="btn" on-tap="review({{i}})">审核</div>
                    </div>
                    <div w-class="titleBox">
                        <div w-class="userInfo">
                            <img src="../../res/images/money.png" alt="" w-class="avatar"/>
                            <div w-class="userName">嗨嗨号名称</div>
                        </div>
                        <div w-class="userName">提交时间：2018-06-21 12:20:12</div>
                    </div>
                </div>
            {{end}}
        </div>
        <div w-class="ctroller">
            <div ev-changeCurrent="pageChange" w-class="pagination" ev-perPage="perPage" ev-expand="expand">
                <widget w-tag="chat-management-components-pagination">{pages:{{Math.ceil(it.sum/ it.perPage)}},filterShow:true,currentIndex:{{it.currentIndex}},expand:{{it.expandIndex}},numberCheckActiveIndex:{{it.perPageIndex}} }</widget>
            </div>
        </div>
    </div>
    <div w-class="articleInfo">
        <div w-class="listItem">
            <div w-class="titleBox">
                <div w-class="title">光荣公布Gust新作《妖精的尾巴》 预计2020年发售</div>
            </div>
            <div w-class="titleBox">
                <div w-class="userInfo">
                    <img src="../../res/images/money.png" alt="" w-class="avatar"/>
                    <div w-class="userName">嗨嗨号名称</div>
                </div>
                <div w-class="userName">提交时间：2018-06-21 12:20:12</div>
            </div>
        </div>
        <div w-class="articleContent">
            <div>发行商光荣特库摩和开发商Gust公布了全新RPG游戏，《妖精的尾巴（FAIRY TAIL）》。本作以同名动画原作为基础展开，并由原作作者真岛浩老师担任监制。《妖精的尾巴》将于2020年登陆PS4、Switch以及PC Steam平台，中文版也将同步发售。发行商光荣特库摩和开发商Gust公布了全新RPG游戏，《妖精的尾巴（FAIRY TAIL）》。本作以同名动画原作为基础展开，并由原作作者真岛浩老师担任监制。《妖精的尾巴》将于2020年登陆PS4、Switch以及PC Steam平台，中文版也将同步发售。发行商光荣特库摩和开发商Gust公布了全新RPG游戏，《妖精的尾巴（FAIRY TAIL）》。本作以同名动画原作为基础展开，并由原作作者真岛浩老师担任监制。《妖精的尾巴》将于2020年登陆PS4、Switch以及PC Steam平台，中文版也将同步发售。发行商光荣特库摩和开发商Gust公布了全新RPG游戏，《妖精的尾巴（FAIRY TAIL）》。本作以同名动画原作为基础展开，并由原作作者真岛浩老师担任监制。《妖精的尾巴》将于2020年登陆PS4、Switch以及PC Steam平台，中文版也将同步发售。 </div>
            <img src="../../res/images/ArrowLeft.png" alt="" w-class="img"/>
        </div>
    </div>
</div>