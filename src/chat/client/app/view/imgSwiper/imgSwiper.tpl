<div style="height:100%;width:100%;"  class="new-page" w-class="new-page">
    <div class="swiper-container" style="height:100%;width:100%;">
        <div class="swiper-wrapper" on-tap="clickSlide">
            {{for i,v of it.list}}
            <div class="swiper-slide bg-img">
                <img src="{{v}}" alt="" w-class="bgImg"/>
            </div>
            {{end}}
        </div>
    </div>
    {{if !it.showOrg}}
    <div w-class="btn" style="left:50px;" on-tap="showOriginal">查看原图</div>
    {{end}}
    {{:fg = true}}
    {{if fg}}
    <div w-class="btn" style="right:50px;" on-tap="download">下载</div>
    {{end}}
    <div w-class="navigation">{{it.activeIndex}}/{{it.list.length}}</div>
</div>