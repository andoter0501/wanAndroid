import { ApiException, RequestMethod, SessionExpiredException } from "@bundle:com.wanandroid.harmony/entry/ets/common/network/ApiModels";
import type { ApiResponse } from "@bundle:com.wanandroid.harmony/entry/ets/common/network/ApiModels";
import { toNetworkError } from "@bundle:com.wanandroid.harmony/entry/ets/common/network/ErrorMessage";
import type { NetworkError } from "@bundle:com.wanandroid.harmony/entry/ets/common/network/ErrorMessage";
import http from "@ohos:net.http";
import { WanAndroidApi } from "@bundle:com.wanandroid.harmony/entry/ets/common/network/WanAndroidApi";
import { SessionStore } from "@bundle:com.wanandroid.harmony/entry/ets/common/storage/SessionStore";
import { SessionEventBus } from "@bundle:com.wanandroid.harmony/entry/ets/common/session/SessionEventBus";
export interface RequestOptions {
    method: RequestMethod;
    path: string;
    query?: Record<string, string | number>;
    body?: string;
    retryCount?: number;
}
/**
 * 网络层骨架：
 * 1. 统一拼接 baseUrl
 * 2. 统一响应解包
 * 3. 统一处理 errorCode 与 -1001
 */
export class ApiClient {
    async request<T>(options: RequestOptions): Promise<T> {
        const totalRetry = options.retryCount ?? (options.method === RequestMethod.GET ? 1 : 0);
        let attempt = 0;
        let lastError: NetworkError | null = null;
        while (attempt <= totalRetry) {
            try {
                return await this.requestOnce<T>(options);
            }
            catch (error) {
                const typedError = toNetworkError(error);
                lastError = typedError;
                if (!this.shouldRetry(typedError, options.method, attempt, totalRetry)) {
                    throw new Error(typedError.message);
                }
                await this.sleep(250 * (attempt + 1));
                attempt++;
            }
        }
        throw new Error(lastError?.message || '请求失败');
    }
    private async requestOnce<T>(options: RequestOptions): Promise<T> {
        const url: string = this.buildUrl(options.path, options.query);
        const request = http.createHttp();
        const body = this.buildBody(options.body, options.method);
        const response = await request.request(url, {
            method: options.method,
            extraData: body,
            expectDataType: http.HttpDataType.STRING,
            connectTimeout: 10000,
            readTimeout: 10000
        });
        request.destroy();
        if (response.responseCode < 200 || response.responseCode >= 300) {
            throw new ApiException(response.responseCode, `网络请求失败: ${response.responseCode}`);
        }
        const json = JSON.parse((response.result as string) || '{}') as ApiResponse<T>;
        if (json.errorCode === 0) {
            return json.data;
        }
        if (json.errorCode === -1001) {
            SessionStore.shared().clear();
            SessionEventBus.emitExpired(json.errorMsg || '登录状态失效');
            throw new SessionExpiredException(json.errorMsg || '登录状态失效');
        }
        throw new ApiException(json.errorCode, json.errorMsg || '服务端返回错误');
    }
    private buildUrl(path: string, query?: Record<string, string | number>): string {
        const fullPath = `${WanAndroidApi.BASE_URL}${path}`;
        if (!query || Object.keys(query).length === 0) {
            return fullPath;
        }
        const queryStr = Object.keys(query)
            .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(String(query[key]))}`)
            .join('&');
        return `${fullPath}${fullPath.includes('?') ? '&' : '?'}${queryStr}`;
    }
    private buildBody(body: string | undefined, method: RequestMethod): string | undefined {
        if (method !== RequestMethod.POST || !body) {
            return undefined;
        }
        return body;
    }
    private shouldRetry(error: NetworkError, method: RequestMethod, attempt: number, totalRetry: number): boolean {
        if (attempt >= totalRetry) {
            return false;
        }
        if (method !== RequestMethod.GET) {
            return false;
        }
        if (error instanceof SessionExpiredException) {
            return false;
        }
        if (error instanceof ApiException) {
            return error.code >= 500 || error.code === 408 || error.code === 429;
        }
        if (error instanceof Error) {
            const msg = error.message || '';
            return msg.includes('Network') || msg.includes('Failed to fetch');
        }
        return false;
    }
    private async sleep(ms: number): Promise<void> {
        await new Promise<void>((resolve) => {
            setTimeout(() => resolve(), ms);
        });
    }
}
