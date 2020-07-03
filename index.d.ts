import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';

type Options = Partial<{
  errorSuffix: string;
  successSuffix: string;
  onSuccess({action, next, response}?: any, options?: any): any;
  onError({action, next, response}?: any, options?: any): any;
  onComplete(): any;
  returnRejectedPromiseOnError: boolean;
  isAxiosRequest: boolean;
  getRequestConfig: AxiosResponse;
  getClientName: AxiosInstance;
  defaultClientName: string;
  getRequestOptions: any;
  interceptors: { request?: any[], response?: any[] };
}>;

export type AxiosMiddleware = {
  default: (client: AxiosInstance, customMiddleWareOptions?: Options, customClientOptions?: any) => any;
  getActionTypes: (action: any) => any;
  multiClientMiddleware: (client: any, customMiddleWareOptions?: Options) => any;
  (client: AxiosInstance, customMiddleWareOptions?: Options, customClientOptions?: any): any;
}

type Client = { client: AxiosInstance, options?: Options };

export type ClientsList = {
  [name: string]: Client;
  default: Client;
}

export function multiClientMiddleware(clients?: ClientsList, customMiddlewareOptions?: Options): any;

declare const axiosMiddleware: AxiosMiddleware;
export default AxiosMiddleware;
