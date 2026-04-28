import { ApiClient } from "@bundle:com.wanandroid.harmony/entry/ets/common/network/ApiClient";
import { RequestMethod } from "@bundle:com.wanandroid.harmony/entry/ets/common/network/ApiModels";
import { WanAndroidApi } from "@bundle:com.wanandroid.harmony/entry/ets/common/network/WanAndroidApi";
import type { HomeArticlePage } from '../home/HomeRepository';
export interface HotKeyItem {
    id: number;
    name: string;
}
export class SearchRepository {
    private readonly apiClient: ApiClient;
    constructor(apiClient: ApiClient = new ApiClient()) {
        this.apiClient = apiClient;
    }
    loadHotKeys(): Promise<HotKeyItem[]> {
        return this.apiClient.request<HotKeyItem[]>({
            method: RequestMethod.GET,
            path: WanAndroidApi.hotKey()
        });
    }
    searchArticles(page: number, keyword: string): Promise<HomeArticlePage> {
        const body = `k=${encodeURIComponent(keyword)}`;
        return this.apiClient.request<HomeArticlePage>({
            method: RequestMethod.POST,
            path: WanAndroidApi.search(page),
            body
        });
    }
}
