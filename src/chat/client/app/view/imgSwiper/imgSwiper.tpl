<div style="height:100%;width:100%;"  class="new-page" w-class="new-page">
    <div class="swiper-container" style="height:100%;width:100%;">
        <div class="swiper-wrapper" on-tap="clickSlide">
            {{for i,v of it.list}}
            <div class="swiper-slide bg-img">
                {{if it.showOrg[i]}}
                    {{if !it.isLoad[i]}}
                        <div>
                            <img src="{{it.thumbnail[i]}}" alt="" w-class="bgImg"/>
                            <img src="../../res/images/loading.gif" alt="" w-class="loading"/>
                        </div>
                    {{end}}
                    <img src="{{v}}" alt="" w-class="bgImg" on-load="load({{i}})" style="display:{{it.isLoad[i]?'block':'none'}}"/>  
                {{else}}
                    <img src="{{it.thumbnail[i]}}" alt="" w-class="bgImg"/>  
                {{end}}
                {{if !it.showOrg[i]}}
                <div w-class="btn" style="left:50px;" on-tap="showOriginal({{i}})">查看原图</div>
                {{end}}
                {{:fg = true}}
                {{if fg}}
                <div w-class="btn" style="right:50px;" on-tap="download({{i}})">下载</div>
                {{end}}
            </div>
            
            {{end}}
        </div>
    </div>
    
    <div w-class="navigation">{{it.activeIndex}}/{{it.list.length}}</div>
</div>