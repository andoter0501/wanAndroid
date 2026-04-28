import { ApiClient } from "@bundle:com.wanandroid.harmony/entry/ets/common/network/ApiClient";
import { RequestMethod } from "@bundle:com.wanandroid.harmony/entry/ets/common/network/ApiModels";
import { WanAndroidApi } from "@bundle:com.wanandroid.harmony/entry/ets/common/network/WanAndroidApi";
export interface BannerItem {
    id: number;
    title: string;
    imagePath: string;
    url: string;
}
export interface ChapterItem {
    id: number;
    name: string;
}
export interface HarmonyIndexData {
    links: ChapterItem[];
    open_sources: ChapterItem[];
    tools: ChapterItem[];
}
export interface HomeArticleItem {
    id: number;
    title: string;
    author?: string;
    shareUser?: string;
    link: string;
    niceDate?: string;
}
export interface HomeArticlePage {
    datas: HomeArticleItem[];
    curPage: number;
    pageCount: number;
}
export class HomeRepository {
    private readonly apiClient: ApiClient;
    constructor(apiClient: ApiClient = new ApiClient()) {
        this.apiClient = apiClient;
    }
    loadBanners(): Promise<BannerItem[]> {
        return this.apiClient.request<BannerItem[]>({
            method: RequestMethod.GET,
            path: WanAndroidApi.banners()
        });
    }
    loadArticlePage(page: number): Promise<HomeArticlePage> {
        return this.apiClient.request<HomeArticlePage>({
            method: RequestMethod.GET,
            path: WanAndroidApi.homeArticles(page)
        });
    }
    loadTopArticles(): Promise<HomeArticleItem[]> {
        return this.apiClient.request<HomeArticleItem[]>({
            method: RequestMethod.GET,
            path: WanAndroidApi.topArticles()
        });
    }
    loadPopularWenda(): Promise<ChapterItem[]> {
        return this.apiClient.request<ChapterItem[]>({
            method: RequestMethod.GET,
            path: WanAndroidApi.popularWenda()
        });
    }
    loadPopularColumn(): Promise<ChapterItem[]> {
        return this.apiClient.request<ChapterItem[]>({
            method: RequestMethod.GET,
            path: WanAndroidApi.popularColumn()
        });
    }
    loadPopularRoute(): Promise<ChapterItem[]> {
        return this.apiClient.request<ChapterItem[]>({
            method: RequestMethod.GET,
            path: WanAndroidApi.popularRoute()
        });
    }
    loadHarmonyIndex(): Promise<HarmonyIndexData> {
        return this.apiClient.request<HarmonyIndexData>({
            method: RequestMethod.GET,
            path: WanAndroidApi.harmonyIndex()
        });
    }
}
