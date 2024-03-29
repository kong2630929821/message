/**
 * 大图 全屏图
 */

// ================================================ 导入
import { Widget } from '../../../../../pi/widget/widget';
import { saveImage } from '../../logic/native';
import { popNewMessage } from '../../logic/tools';

interface Props {
    img: string;  // 图片
    originalImg:string; // 原图
    showOrg:boolean; // 是否显示原图
    list:any;
}

// ================================================ 导出
export class BigImage extends Widget {
    public props: Props;
    public ok: () => void;

    public closePage() {
        this.ok && this.ok();
    }

    // 查看原图
    public showOriginal() {
        this.props.showOrg = true;
        this.paint();
    }

    // 下载图片
    public download() {
        saveImage(this.props.originalImg,() => {
            popNewMessage('保存成功');
        });
    }

}