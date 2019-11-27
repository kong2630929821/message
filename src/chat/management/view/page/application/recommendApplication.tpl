<div w-class="page">
    <div w-class="recommendTop" style="margin-top: 30px;">HOT游戏（最多添加8个）</div>
    <div w-class="addHot">
        {{for i,v of it.hotApp}}
        <div w-class="hotItem">
            <img src="{{it.buildupImgPath(v.img[0])}}" alt="" w-class="iocn"/>
            <div w-class="name">{{v.title}}</div>
            <img src="../../../res/images/remove.png" alt="" w-class="closeIcon" on-tap="delApp(2,{{i}})"/>
        </div>
        {{end}}

        {{if it.hotApp.length < 8 }}
            <div w-class="hotItem">
                <div w-class="add" on-tap="addApp(2)">
                    <img src="../../../res/images/add_black.png" alt="" w-class="addIcon"/>
                </div>
                <div w-class="name"></div>
            </div>
        {{end}}
    </div>
    <div w-class="recommendTop">编辑推荐（最多添加3个）</div>
    <div w-class="addRecommend">

        {{for i,v of it.recommendApp}}
            <div w-class="recommendItem">
                <img src="{{it.buildupImgPath(v.img[1])}}" alt="" w-class="rowIcon"/>
                <div w-class="recommendInfo">
                    <img src="{{it.buildupImgPath(v.img[0])}}" alt="" w-class="infoIcon"/>
                    <div w-class="info">
                        <div w-class="infoName">{{v.title}}</div>
                        <div w-class="infoDesc">{{v.subtitle}}</div>
                    </div>
                </div>
                <img src="../../../res/images/remove.png" alt="" w-class="closeIcon" on-tap="delApp(1,{{i}})"/>
            </div>
        {{end}}

        {{if it.recommendApp.length < 3}}
            <div w-class="recommendItem">
                <div w-class="addRecommendItem" on-tap="addApp(1)">
                    <img src="../../../res/images/add_black.png" alt="" w-class="addIcon"/>
                </div>
            </div>
        {{end}}
    </div>

</div>
