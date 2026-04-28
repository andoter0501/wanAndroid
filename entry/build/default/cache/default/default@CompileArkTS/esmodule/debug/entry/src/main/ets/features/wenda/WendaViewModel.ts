import { UiState } from "@bundle:com.wanandroid.harmony/entry/ets/common/ui/LoadState";
import { parseErrorMessage } from "@bundle:com.wanandroid.harmony/entry/ets/common/network/ErrorMessage";
import { WendaRepository } from "@bundle:com.wanandroid.harmony/entry/ets/features/wenda/WendaRepository";
import type { WendaComment, WendaItem } from "@bundle:com.wanandroid.harmony/entry/ets/features/wenda/WendaRepository";
export class WendaViewModel {
    private readonly repository: WendaRepository;
    wendaState: UiState<WendaItem[]> = UiState.loading<WendaItem[]>();
    commentState: UiState<WendaComment[]> = UiState.empty<WendaComment[]>('请选择问答查看评论');
    commentSortDesc: boolean = true;
    private page: number = 1;
    private hasMore: boolean = false;
    isLoadingMore: boolean = false;
    constructor(repository: WendaRepository = new WendaRepository()) {
        this.repository = repository;
    }
    async init(): Promise<void> {
        await this.loadWendaFirstPage();
    }
    async loadWendaFirstPage(): Promise<void> {
        this.wendaState = UiState.loading<WendaItem[]>();
        try {
            const data = await this.repository.loadWenda(1);
            const items = data.datas || [];
            this.page = 1;
            this.hasMore = data.curPage < data.pageCount;
            this.wendaState = items.length > 0 ? UiState.success(items) : UiState.empty('暂无问答内容');
        }
        catch (error) {
            this.wendaState = UiState.error<WendaItem[]>(parseErrorMessage(error));
        }
    }
    async loadMore(): Promise<void> {
        if (this.isLoadingMore || !this.hasMore || !this.wendaState.data) {
            return;
        }
        this.isLoadingMore = true;
        try {
            const nextPage = this.page + 1;
            const data = await this.repository.loadWenda(nextPage);
            this.wendaState = UiState.success(this.wendaState.data.concat(data.datas || []));
            this.page = nextPage;
            this.hasMore = data.curPage < data.pageCount;
        }
        catch (_) {
            // 保持当前数据
        }
        finally {
            this.isLoadingMore = false;
        }
    }
    async loadComments(wendaId: number): Promise<void> {
        this.commentState = UiState.loading<WendaComment[]>();
        try {
            const data = await this.repository.loadComments(wendaId);
            this.commentState = data.length > 0 ? UiState.success(data) : UiState.empty('暂无评论');
        }
        catch (error) {
            this.commentState = UiState.error<WendaComment[]>(parseErrorMessage(error));
        }
    }
    getSortedComments(): WendaComment[] {
        const comments = this.commentState.data || [];
        const sorted = comments.slice().sort((a, b) => {
            return this.commentSortDesc ? (b.zan - a.zan) : (a.zan - b.zan);
        });
        return sorted;
    }
    toggleCommentSort(): void {
        this.commentSortDesc = !this.commentSortDesc;
    }
    canLoadMore(): boolean {
        return this.hasMore;
    }
}
