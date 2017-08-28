import axios, {AxiosInstance, AxiosError, AxiosResponse} from 'axios';

export interface suffixTypes {
  errorSuffix: string;
  successSuffix: string;
}

export interface axiosMiddleware extends suffixTypes {
  default: (client: AxiosInstance, customMiddleWareOptions: any, customClientOptions: any) => any;
  getActionTypes: (action: any) => any;
  multiClientMiddleware: (client: any, customMiddleWareOptions: any) => any;

  (client: AxiosInstance, customMiddleWareOptions?: any, customClientOptions?: any): any;
}


export interface IClientsList {
  [name: string]: { client: AxiosInstance };

  default: { client: AxiosInstance };
}

declare const axiosMiddleware: axiosMiddleware;

export function multiClientMiddleware(clients?: IClientsList, customMiddlewareOptions?: any): any;

export const returnRejectedPromiseOnError: boolean;

export const defaultClientName: string;

export const isAxiosRequest: boolean;

export const getRequestConfig: AxiosResponse;

export const getClientName: AxiosInstance;

export const getRequestOptions: any;

export function onSuccess({action, next, response}?: any, options?: any): any;

export function onError({action, next, response}?: any, options?: any): any;

export function onComplete(): any;


export default axiosMiddleware;
