<div w-class="auto" on-tap="pageClick" id="squarePage" on-scroll="scrollPage">
    <div id="squareContain" style="background: white;">

        {{%=============1:关注  2:公众号===================}}
        {{if it.active==1}}
        <div w-class="setting" on-tap="goManage">
            <img src="../../res/images/setting.png" w-class="img"/>
            <span style="flex:1 0 0;">我已关注 {{it.follows.length}}人
                {{if it.active==2}}
                <span w-class="public">公众号</span>
                {{end}}
            </span>
            <img src="../../res/images/arrowRight.png" w-class="img"/>
        </div>
        {{end}}
        
        {{if it.active>=2}}
            <div w-class="gameTag">
                <div w-class="gameBgBox">
                    <div w-class="imgBg" style="background:url({{it.gameLabel.bg}})center"></div>
                    <div w-class="opacityBox"></div>
                </div>
                <div w-class="gameInfo">
                    <img src="{{it.gameLabel.icon}}" alt="" w-class="gameIcon"/>
                    <div w-class="contentInfo">
                        <div w-class="gameName">{{it.gameLabel.name}}</div>
                        <div w-class="postNum">帖子 {{it.gameLabel.num}}</div>
                        <div w-class="gotoGame">
                            <div w-class="gameHaihai">
                                官方嗨嗨号
                                <img src="../../res/images/whiteRight.png" alt="" w-class="rightIcon"/>
                            </div>
                            <div w-class="gameHaihai" style="margin-left:30px;" on-tap="goGame">
                                玩游戏
                                <img src="../../res/images/whiteRight.png" alt="" w-class="rightIcon"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        {{end}}

        {{for i,v of it.postView[it.active][1].postList}}
        <div ev-goDetail="goDetail({{i}})" ev-tools-expand="expandTools(e,{{i}})" ev-closeTools="pageClick">
            {{if v.isPublic}}
            <widget w-tag="chat-client-app-view-home-pubPostItem">{{v}}</widget>
            {{else}}
            <div ev-likeBtn="likeBtn({{i}})" ev-commentBtn="commentBtn({{i}})" ev-delBtn="delPost({{i}})">
                <widget w-tag="chat-client-app-view-home-squareItem">{{it.dealData(v,it.postView[it.active][1].expandItem == i)}}</widget>
            </div>
            {{end}}
        </div>
        {{end}}

                         
        <div w-class="loadAnimation">
            {{if it.postView[it.active][1].isLoading}}  
            <img src="../../res/images/loading.gif" alt=""/>
                <div>加载中···</div> 
            {{else}}
            <div>已经到底了~</div>
            {{end}}
        </div>            
            
    </div>
</div>
