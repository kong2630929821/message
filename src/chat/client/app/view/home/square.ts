// tslint:disable-next-line:missing-jsdoc
import { getStore as walletGetStore,setStore as walletSetStore } from '../../../../../app/store/memstore';
import { popNew3 } from '../../../../../app/utils/tools';
import { gotoSquare } from '../../../../../app/view/base/app';
import { openGame } from '../../../../../app/view/play/home/gameConfig';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { getStore,PostItem, register, setStore } from '../../data/store';
import { gameLabelNum, showPost } from '../../net/rpc';

export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

interface PostListForShow {
    expandItem:number;
    postList:PostItem[];    
    isLoading:boolean;//     
}

type PostPage = [string, PostListForShow];

interface Props  {
    postView:PostPage[];
    active:number;
    follows:any[];
    dealData:any;
    gameLabel:any;
}

// tslint:disable-next-line:completed-docs
export class Square extends Widget {
    public state:State = state;
    public props:Props = {        
        postView:[],
        active:-1,
        follows:[],
        dealData:this.dealData,
        gameLabel:{
            name:'',
            icon:'',
            bg:'',
            num:0
        }    
    };    

    constructor() {
        super();
        getStore(`tagList`,[]).forEach((tag) => {
            this.props.postView.push([tag, {
                expandItem:-1,
                postList:[],
                // canRequest:true,
                isLoading:false
                // isShowAnimation:false
            }]);
        });    
    }
    public create() {
        super.create();
        this.state = state;
    }
    public setProps(props:any) {   
        console.log('square props: ',props);            
        if (this.props.active !== props.active) {
            if (props.active >= 2) {
                const label = getStore(`tagList`)[props.active];
                const game = getStore(`gameList`);
                
                setStore('flags/nowSquareType',{ squareType:5,label });
                showPost(5,label);
                gameLabelNum(label).then(r => {
                    let index = null;
                    game.forEach((v,i) => {
                        if (v.title === label) {
                            index = i;
                        }
                    });
                    this.props.gameLabel = {
                        name:label,
                        icon:game[index].img[0],
                        bg:game[index].img[1],
                        num:r === -1 ? 0 :r
                    };
                    this.paint();
                });
            } else {
                showPost(props.active + 1,'');
            } 
        }
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        // this.state = state;  
        this.init(this.props.active);     
    }
    // public firstPaint() {
    //     super.firstPaint();
    //     register('uid',() => {  // 聊天用户登陆成功
    //         // this.setProps(this.props);
    //         showPost(this.props.active + 1);
    //     });
    // }
    public init(ind:number) {
        // TODO:
        if (ind === 2) {
            const pubNum = getStore('pubNum', 0);
            
            this.state ? this.props.follows = this.state.followList.public_list.filter(v => {

                return v !== pubNum;
            }) : this.props.follows = []; 
        } else {
            const user = getStore(`userInfoMap/${getStore('uid')}`, {});
            this.state ? this.props.follows = this.state.followList.person_list.filter(v => {
                return v !== user.comm_num;
            }) : this.props.follows = [];
        } 
    }

    // 管理我关注的公众号 其他账号
    public goManage() {
        popNew3('chat-client-app-view-person-manageFollow',{ followList:this.props.follows });
    }

    /**
     * reload setState
     */
    public setState(state:JSON) {
        super.setState(state);
        if (!this.state) {            
            // alert(`the state is : ${JSON.stringify(this.state)}`);

            return;
        }
        // 加载第一页
        if (this.state.postReturn.id === 0 && this.state.postReturn.num === '') {
            this.props.postView[this.state.postReturn.tagType - 1][1].expandItem = -1;
            this.props.postView[this.state.postReturn.tagType - 1][1].postList = this.state.postReturn.postList;
            // this.props.postView[this.state.postReturn.tagType - 1][1].canRequest = true;
            this.props.postView[this.state.postReturn.tagType - 1][1].isLoading = false;
            // this.props.postView[this.state.postReturn.tagType - 1][1].isShowAnimation = false;        
            
            // 回滚到顶部
            const  squarePage = document.querySelector('#squarePage');     
            squarePage ? squarePage.scrollTop = 0 :'';
        } else {
        // 加载第2页数据
            this.props.postView[this.state.postReturn.tagType - 1][1].expandItem = -1;
            this.props.postView[this.state.postReturn.tagType - 1][1].postList = 
                this.props.postView[this.state.postReturn.tagType - 1][1].postList.concat(this.state.postReturn.postList);
            // this.props.postView[this.state.postReturn.tagType - 1][1].canRequest = true;
            this.props.postView[this.state.postReturn.tagType - 1][1].isLoading = false;
            // this.props.postView[this.state.postReturn.tagType - 1][1].isShowAnimation = false;        
        }
    }
    
    /**
     * 评论
     */
    public commentBtn(i:number) {
        const v = this.props.postView[this.props.active][1].postList[i];
        popNew3('chat-client-app-view-info-editComment',{ key:v.key },() => {
            v.commentCount ++;
            this.paint();
            popNew3('chat-client-app-view-info-postDetail',{ postItem:v,showAll:true });
        });
    }

    /**
     * 删除
     */
    public delPost(i:number) {
        this.props.postView[this.props.active][1].postList.splice(i,1);
        this.paint();
    }

    /**
     * 查看详情
     */
    public goDetail(i:number) {
        popNew3('chat-client-app-view-info-postDetail',{ postItem:this.props.postView[this.props.active][1].postList[i],showAll:true },(value) => {
            if (value !== undefined) {
                gotoSquare(value);
            }
        });
    }

    /**
     * 展示操作
     */
    public expandTools(e:any,i:number) {
        this.props.postView[this.props.active][1].expandItem = e.value ? i :-1;
        this.paint();
    }

    public pageClick() {
        this.props.postView[this.props.active][1].expandItem = -1;
        this.paint();
    }

    /**
     * 组装squareItem的数据
     */
    public dealData(v:any,r:boolean) {
        return { 
            postItem:v,
            showUtils: r 
        };
    }

    /**
     * 滚动加载更多帖子
     */
    public scrollPage() {

        // console.log('123');
        this.props.postView[this.props.active][1].expandItem = -1;
        const page = document.getElementById('squarePage');
        const contain = document.getElementById('squareContain');
        const fg = !this.props.postView[this.props.active][1].isLoading && (contain.offsetHeight - page.scrollTop - page.offsetHeight) < 150;           
        if (fg) {
            this.props.postView[this.props.active][1].isLoading = true;
            const list = this.props.postView[this.props.active][1].postList;
            const typeNum = this.props.active >= 2 ? 5 :this.props.active + 1;
            showPost(typeNum,getStore(`tagList`)[this.props.active],list[list.length - 1].key.num,list[list.length - 1].key.id).then(() => {
                this.props.postView[this.props.active][1].isLoading = false;
                this.paint();                
            }).catch(() => {                
                this.props.postView[this.props.active][1].isLoading = false;
                this.paint();                
            });
        }        
        this.paint();
    }

    /**
     * 玩游戏
     */
    public goGame() {
        const gameList = getStore(`gameList`);
        gameList.forEach(v => {
            if (v.title === this.props.gameLabel.name) {
                // 打开游戏
                openGame(v.url,v.title,v.webviewName,v.screenMode,() => {
                    const game = walletGetStore('game');
                    if (game.oftenGame.findIndex(item => item.appid === v.appid) === -1) {
                        game.oftenGame.push(v);
                    }
                    walletSetStore('game',game);
                });
            }
        });
    }
}

type FollwList = {
    person_list:any[];
    public_list:any[];
};

type postReturn = {
    id:number;
    num:string;
    tagType:number;
    postList:any[];
};

interface State {
    followList:FollwList;
    postReturn:postReturn;
}

const state:State = {
    followList:{
        person_list:[],
        public_list:[]
    },
    postReturn:{
        id:-1,
        num:'',
        tagType:-1,
        postList:[]  
    }
};

// 关注列表  用于维护该用户的所有帖子是否关注，而不是当前这一个
register('followNumList',r => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        if (w.state.postReturn.tagType === -1) {
            return;
        }
        for (const value of r.values()) {
            state.followList = value;
            const list = value.person_list.concat(value.public_list);
            w.props.postView[w.state.postReturn.tagType - 1][1].postList.forEach((v,i) => {
                w.props.postView[w.state.postReturn.tagType - 1][1].postList[i].followed = list.indexOf(v.key.num) > -1;
            });
        }
        forelet.paint(state);
    }
});

// 帖子数据
register('postReturn',r => {    
    state.postReturn = r;    
    forelet.paint(state);
});

// 监听游戏标签变化
register('tagList',r => {   
    const w:any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        const oldData = w.props.postView;
        w.props.postView = [];
        // 需要根据taglist的顺序来调整postview的顺序
        r.forEach((tag) => {            
            const index = oldData.findIndex((e) => e[0] === tag);
            if (index < 0) {
                w.props.postView.push([tag, {
                    expandItem:-1,
                    postList:[],
                    isLoading:false
                }]);    
            } else {
                w.props.postView.push([tag,oldData[index][1]]);
            }          
        }); 
        w.paint(); 
    } 
});
