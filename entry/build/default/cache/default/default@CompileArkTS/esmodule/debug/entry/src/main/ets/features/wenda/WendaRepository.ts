import { ApiClient } from "@bundle:com.wanandroid.harmony/entry/ets/common/network/ApiClient";
import { RequestMethod } from "@bundle:com.wanandroid.harmony/entry/ets/common/network/ApiModels";
import { WanAndroidApi } from "@bundle:com.wanandroid.harmony/entry/ets/common/network/WanAndroidApi";
export interface WendaItem {
    id: number;
    userId?: number;
    title: string;
    author?: string;
    shareUser?: string;
    link: string;
    niceDate?: string;
}
export interface WendaPageData {
    datas: WendaItem[];
    curPage: number;
    pageCount: number;
}
export interface WendaComment {
    id: number;
    userName: string;
    content: string;
    niceDate: string;
    zan: number;
}
export class WendaRepository {
    private readonly apiClient: ApiClient;
    constructor(apiClient: ApiClient = new ApiClient()) {
        this.apiClient = apiClient;
    }
    loadWenda(page: number): Promise<WendaPageData> {
        return this.apiClient.request<WendaPageData>({
            method: RequestMethod.GET,
            path: WanAndroidApi.wendaList(page)
        });
    }
    loadComments(id: number): Promise<WendaComment[]> {
        return this.apiClient.request<WendaComment[]>({
            method: RequestMethod.GET,
            path: WanAndroidApi.wendaComments(id)
        });
    }
}
