import { Store } from "vuex";
import axios from "axios";
import { message, notification, Modal } from "ant-design-vue";

declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    $store: Store<any>;
    $http: typeof axios;
    $message: typeof message;
    $notification: typeof notification;
    $modal: typeof Modal;
    $modalInstance: {
      destroy: () => void;
    };
    /**
     * 将组件以弹窗形式打开
     */
    $modalComp: ({ title, comp, props, ...rest }) => void;
    /**
     * 将组件以抽屉形式打开
     */
    $drawerComp: ({ title, comp, props, ...rest }) => void;
    /**
     * 获取字典数组
     */
    $getDic: (key: string, isNum?: boolean) => any[];
    /**
     * 小数点截取
     */
    $toFixed: (num: string | number, fractionDigits?: number) => string;
    /**
     * 格式化日期
     */
    $formatDate: (date: Date | number | string | dayjs.Dayjs, dateFormat?: string) => string;
    /**
     * 格式化日期数组
     */
    $formatDateRange: (dateRange: any[], strictTime?: boolean) => {};
    /**
     * 下载文件
     */
    $downloadFile: (url: string) => void;
    /**
     * 打印
     */
    $print: (url: string) => void;
    $striped;
    $require;
  }
}
