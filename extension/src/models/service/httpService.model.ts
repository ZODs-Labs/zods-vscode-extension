import { CancelToken, CancelTokenSource } from 'axios';

import { HttpRequestParams } from '@common/types';

export interface IHttpService {
   /**
    * Performs a request to the specified URL.
    * @param route API route to send the request to.
    * @param method HTTP method to use.
    * @param data Data to send with the request.
    * @param params Parameters to send with the request.
    */
   request<T>(
      route: string,
      method: 'get' | 'post' | 'put' | 'delete',
      data?: any,
      params?: HttpRequestParams,
      cancelToken?: CancelToken
   ): Promise<T | number>;

   /**
    * Performs a GET request to the specified URL.
    * @param url URL to send the request to.
    * @param params Parameters to send with the request.
    */
   get<T>(
      url: string,
      params?: HttpRequestParams,
      cancelToken?: CancelToken
   ): Promise<T>;

   /**
    * Performs a POST request to the specified URL.
    * @param url URL to send the request to.
    * @param body Body to send with the request.
    */
   post<T>(
      url: string,
      body: any,
      params?: HttpRequestParams,
      cancelToken?: CancelToken
   ): Promise<T>;

   /**
    * Performs a PUT request to the specified URL.
    * @param url URL to send the request to.
    * @param body Body to send with the request.
    */
   put<T>(
      url: string,
      body: any,
      params?: HttpRequestParams,
      cancelToken?: CancelToken
   ): Promise<T>;

   /**
    * Performs a PUT request to the specified URL.
    * @param url URL to send the request to.
    * @param body Body to send with the request.
    */
   delete(
      url: string,
      params?: HttpRequestParams,
      cancelToken?: CancelToken
   ): Promise<number>;

   /**
    * Generates a cancel token source.
    */
   generateCancelTokenSource(): CancelTokenSource;
}
