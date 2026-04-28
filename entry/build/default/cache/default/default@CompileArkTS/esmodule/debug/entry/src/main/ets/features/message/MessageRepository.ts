import { ApiClient } from "@bundle:com.wanandroid.harmony/entry/ets/common/network/ApiClient";
import { RequestMethod } from "@bundle:com.wanandroid.harmony/entry/ets/common/network/ApiModels";
import { WanAndroidApi } from "@bundle:com.wanandroid.harmony/entry/ets/common/network/WanAndroidApi";
export interface MessageItem {
    id: number;
    title: string;
    fullLink?: string;
    message: string;
    niceDate: string;
}
export interface MessagePageData {
    datas: MessageItem[];
    curPage: number;
    pageCount: number;
}
export class MessageRepository {
    private readonly apiClient: ApiClient;
    constructor(apiClient: ApiClient = new ApiClient()) {
        this.apiClient = apiClient;
    }
    loadUnreadCount(): Promise<number> {
        return this.apiClient.request<number>({
            method: RequestMethod.GET,
            path: WanAndroidApi.unreadMessageCount()
        });
    }
    loadUnreadList(page: number): Promise<MessagePageData> {
        return this.apiClient.request<MessagePageData>({
            method: RequestMethod.GET,
            path: WanAndroidApi.unreadMessageList(page)
        });
    }
    loadReadList(page: number): Promise<MessagePageData> {
        return this.apiClient.request<MessagePageData>({
            method: RequestMethod.GET,
            path: WanAndroidApi.readMessageList(page)
        });
    }
}
