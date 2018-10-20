// ============================== 导入
import { addWidget } from "../../../../pi/widget/util";
import { open, destory, popNew } from "../../../../pi/ui/root";
// ============================== 导出
export const run = () => {
    let currentTime = (new Date).getTime();
    addWidget(document.body, "pi-ui-root");
    document.oncontextmenu = function (e) {
        //或者return false;
        e.preventDefault();
    };
    open("client-app-view-login-login");
}
