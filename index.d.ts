export interface axiosMiddleware {
  ERROR_SUFFIX: string;
  SUCCESS_SUFFIX: string;
  default: (client: any, customMiddleWareOptions: any, customClientOptions: any) => any;
  getActionTypes: (action: any) => any;
  multiClientMiddleware: (client: any, customMiddleWareOptions: any) => any;

  (client?: any, customMiddleWareOptions?: any, customClientOptions?: any): any;
}


declare const axiosMiddleware: axiosMiddleware;


export default axiosMiddleware;
