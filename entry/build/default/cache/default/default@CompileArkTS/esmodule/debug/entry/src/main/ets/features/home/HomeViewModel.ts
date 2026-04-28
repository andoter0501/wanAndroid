import { UiState } from "@bundle:com.wanandroid.harmony/entry/ets/common/ui/LoadState";
import { parseErrorMessage } from "@bundle:com.wanandroid.harmony/entry/ets/common/network/ErrorMessage";
import { HomeRepository } from "@bundle:com.wanandroid.harmony/entry/ets/features/home/HomeRepository";
import type { BannerItem, ChapterItem, HarmonyIndexData, HomeArticleItem } from "@bundle:com.wanandroid.harmony/entry/ets/features/home/HomeRepository";
export class HomeViewModel {
    private readonly repository: HomeRepository;
    state: UiState<HomeArticleItem[]> = UiState.loading<HomeArticleItem[]>();
    banners: BannerItem[] = [];
    topArticles: HomeArticleItem[] = [];
    popularWenda: ChapterItem[] = [];
    popularColumn: ChapterItem[] = [];
    popularRoute: ChapterItem[] = [];
    harmony: HarmonyIndexData | null = null;
    private page: number = 0;
    private hasMore: boolean = true;
    isLoadingMore: boolean = false;
    constructor(repository: HomeRepository = new HomeRepository()) {
        this.repository = repository;
    }
    async init(): Promise<void> {
        this.state = UiState.loading<HomeArticleItem[]>();
        try {
            const results = await Promise.all([
                this.repository.loadBanners(),
                this.repository.loadTopArticles(),
                this.repository.loadPopularWenda(),
                this.repository.loadPopularColumn(),
                this.repository.loadPopularRoute(),
                this.repository.loadHarmonyIndex(),
                this.repository.loadArticlePage(0)
            ]);
            this.banners = results[0];
            this.topArticles = results[1];
            this.popularWenda = results[2];
            this.popularColumn = results[3];
            this.popularRoute = results[4];
            this.harmony = results[5];
            const pageData = results[6];
            const articles = pageData.datas || [];
            this.page = 0;
            this.hasMore = pageData.curPage < pageData.pageCount;
            this.state = articles.length > 0 ? UiState.success(articles) : UiState.empty('首页暂无文章');
        }
        catch (error) {
            this.state = UiState.error<HomeArticleItem[]>(parseErrorMessage(error));
        }
    }
    async refresh(): Promise<void> {
        await this.init();
    }
    async loadMore(): Promise<void> {
        if (this.isLoadingMore || !this.hasMore || !this.state.data) {
            return;
        }
        this.isLoadingMore = true;
        try {
            const nextPage = this.page + 1;
            const pageData = await this.repository.loadArticlePage(nextPage);
            const merged = this.state.data.concat(pageData.datas || []);
            this.state = UiState.success(merged);
            this.page = nextPage;
            this.hasMore = pageData.curPage < pageData.pageCount;
        }
        catch (_) {
            // 分页失败不覆盖主状态，只终止本次加载
        }
        finally {
            this.isLoadingMore = false;
        }
    }
    canLoadMore(): boolean {
        return this.hasMore;
    }
}
