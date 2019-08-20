import { getKeyBoardHeight } from '../../../../../pi/ui/root';
import { notify } from '../../../../../pi/widget/event';
import { getRealNode } from '../../../../../pi/widget/painter';
import { Widget } from '../../../../../pi/widget/widget';

interface Props {
    title:string;
    placeholder:string;
    contentInput:string;
    img:string;
    username:string;
    comment:string;
    showOrg:boolean;  // 显示原评论
}

/**
 * 评论或回复
 */
export class EditComment extends Widget {
    public ok:(msg:string) => void;
    public cancel:() => void;
    public props:Props = {
        title:'评论',
        placeholder:'说说心得',
        contentInput:'',
        img:'../../res/images/user_avatar.png',
        username:'用户2',
        comment:'Cras quis nulla commodo, aliquam lectus sed, blandit augue. Cras ullamcorper bibendum. Duis ncidunt urna non pretium porta. Nam vitae ligula vel on pr Nam vitae ligula vel on pr',
        showOrg:false
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
    }

    public close() {
        this.cancel && this.cancel();
    }

    /**
     * 输入评论
     */
    public contentChange(e:any) {
        this.props.contentInput = e.value;
        this.paint();
    }

    public send() {
        this.ok && this.ok(this.props.contentInput);
    }

    // 打开表情包图库
    public openEmoji(e:any) {
        getRealNode(this.tree).getElementsByTagName('textarea')[0].blur();
        document.getElementById('emojiMap').style.height = `${getKeyBoardHeight()}px`;
        setTimeout(() => {
            notify(e.node,'ev-open-Emoji',{});
        }, 100);
        
    }
    
}