/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import axios, {
   AxiosInstance,
   AxiosResponse,
   CancelToken,
   CancelTokenSource,
} from 'axios';

import { KeyValueMap } from '@common/types';
import { HttpRequestParams } from '@common/types/http.types';
import { ApiUtils } from '@common/utils';
import config from '@config/constants';
import { AuthService } from '@core/services';
import { IHttpService, IVSCodeService } from '@models/service';

export class HttpService implements IHttpService {
   private client: AxiosInstance;

   constructor(private vscodeService: IVSCodeService) {
      this.client = {} as any;
      this.initClient();
   }

   request<T>(
      route: string,
      method: 'get' | 'post' | 'put' | 'delete',
      data?: any,
      params?: HttpRequestParams,
      cancelToken?: CancelToken
   ): Promise<T | number> {
      switch (method) {
         case 'get':
            return this.get(route, params, cancelToken);
         case 'post':
            return this.post(route, data, params, cancelToken);
         case 'put':
            return this.put(route, data, params, cancelToken);
         case 'delete':
            return this.delete(route, params, cancelToken);
         default:
            return Promise.reject('Invalid method');
      }
   }

   get<T>(
      route: string,
      params?: HttpRequestParams,
      cancelToken?: CancelToken
   ): Promise<T> {
      const formattedRoute = this.formatRoute(route, params?.routeParams);
      return this.client.get(formattedRoute, {
         params: params?.queryParams,
         cancelToken,
      });
   }
   post<T>(
      route: string,
      body: any,
      params?: HttpRequestParams,
      cancelToken?: CancelToken
   ): Promise<T> {
      const formattedRoute = this.formatRoute(route, params?.routeParams);
      return this.client.post(formattedRoute, body, {
         cancelToken,
      });
   }
   put<T>(
      route: string,
      body: any,
      params?: HttpRequestParams,
      cancelToken?: CancelToken
   ): Promise<T> {
      const formattedRoute = this.formatRoute(route, params?.routeParams);
      return this.client.put(formattedRoute, body, {
         cancelToken,
      });
   }
   delete(
      route: string,
      params?: HttpRequestParams,
      cancelToken?: CancelToken
   ): Promise<number> {
      const formattedRoute = this.formatRoute(route, params?.routeParams);
      return this.client.delete(formattedRoute, {
         cancelToken,
      });
   }

   generateCancelTokenSource(): CancelTokenSource {
      return axios.CancelToken.source();
   }

   private initClient() {
      const agent = `${config.EXTENSION_NAME}/${config.EXTENSION_VERSION} VSCode/${this.vscodeService.version}`;

      this.client = axios.create({
         baseURL: config.API_URL,
         headers: {
            'Content-Type': 'application/json',
            'User-Agent': agent,
         },
      });

      this.client.interceptors.response.use(
         (response: AxiosResponse<any, any>) => {
            const { status, data } = response;
            if (status >= 200 && status < 300) {
               return data;
            }

            return response;
         }
      );

      AuthService.TokenEventEmitter.event((token) => {
         this.client.defaults.headers.common[
            'Authorization'
         ] = `Bearer ${token}`;
      });
   }

   private formatRoute(route: string, routeParams?: KeyValueMap): string {
      return routeParams ? ApiUtils.formatRoute(route, routeParams) : route;
   }
}

export default HttpService;
