
import { popNewMessage } from '../../../../../app/utils/tools';
import { getRealNode } from '../../../../../pi/widget/painter';
import { Widget } from '../../../../../pi/widget/widget';
import { saveImage } from '../../logic/native';
import { Swiper } from '../../res/js/swiper.min';

interface Props {
    activeIndex:number;// 当前下标
    list:any;   // image path列表
    showOrg:boolean;// 是否展示原图
}
/**
 * 轮播图组件
 */
export class ImgSwiper extends Widget {
    public swiper:any;
    public ok:() => void;
    public props:Props = {
        list:[],
        activeIndex:1,
        showOrg:false
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        console.log('ImgSwiper ====',this.props);
    }
    
    public attach() {
        super.attach();
        if (this.swiper || this.props.list.length <= 1) return;
        setTimeout(() => {
            if (this.props.list.length > 1) {
                this.initSwiper();
            }
        },500);
    }

    public afterUpdate() {
        super.afterUpdate();
        if (this.swiper) return;
        setTimeout(() => {
            if (this.props.list.length > 1) {
                this.initSwiper();
            }
        },500);
    }

    // 初始化swiper
    public initSwiper() {
        const $root = getRealNode((<any>this.tree).children[0]);
        this.swiper = new Swiper ($root, {
            initialSlide:this.props.activeIndex - 1,
            loop: false, // 循环模式选项
            observer:true,// 修改swiper自己或子元素时，自动初始化swiper
            observeParents:true,// 修改swiper的父元素时，自动初始化swiper
            // autoplay: {
            //     delay: 2000,
            //     stopOnLastSlide: false,
            //     disableOnInteraction: false
            // },
            on:{
                slideChangeTransitionStart: (r) => {
                    if (this.swiper) {
                        this.props.activeIndex = this.swiper.activeIndex + 1;
                        this.paint();
                    }
                }
            }
        });   

    }
    public clickSlide(e:any) {
        this.ok && this.ok();
    }

    // 查看原图
    public showOriginal() {
        this.props.showOrg = true;
        this.paint();
    }
    
    // 下载图片
    public download() {
        saveImage(this.props.list[this.props.activeIndex],() => {
            popNewMessage('保存成功');
        });
    }
}