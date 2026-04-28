import { ApiClient } from "@bundle:com.wanandroid.harmony/entry/ets/common/network/ApiClient";
import { RequestMethod } from "@bundle:com.wanandroid.harmony/entry/ets/common/network/ApiModels";
import { WanAndroidApi } from "@bundle:com.wanandroid.harmony/entry/ets/common/network/WanAndroidApi";
export interface PlazaArticle {
    id: number;
    userId?: number;
    title: string;
    author?: string;
    shareUser?: string;
    link: string;
    niceDate?: string;
}
export interface PlazaPageData {
    datas: PlazaArticle[];
    curPage: number;
    pageCount: number;
}
export class PlazaRepository {
    private readonly apiClient: ApiClient;
    constructor(apiClient: ApiClient = new ApiClient()) {
        this.apiClient = apiClient;
    }
    loadPlaza(page: number): Promise<PlazaPageData> {
        return this.apiClient.request<PlazaPageData>({
            method: RequestMethod.GET,
            path: WanAndroidApi.plazaList(page)
        });
    }
    loadMyShare(page: number): Promise<PlazaPageData> {
        return this.apiClient.request<PlazaPageData>({
            method: RequestMethod.GET,
            path: WanAndroidApi.myShareList(page)
        });
    }
    shareArticle(title: string, link: string): Promise<string> {
        const body = `title=${encodeURIComponent(title)}&link=${encodeURIComponent(link)}`;
        return this.apiClient.request<string>({
            method: RequestMethod.POST,
            path: WanAndroidApi.shareArticle(),
            body
        });
    }
    deleteSharedArticle(id: number): Promise<string> {
        return this.apiClient.request<string>({
            method: RequestMethod.POST,
            path: WanAndroidApi.deleteSharedArticle(id)
        });
    }
}
