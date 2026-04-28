if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface SearchPage_Params {
    onBack?: () => void;
    onOpenLink?: (url: string) => void;
    vm?: SearchViewModel;
    favoriteVersion?: number;
    favoriteListener?;
}
import { ArticleCard } from "@bundle:com.wanandroid.harmony/entry/ets/common/ui/components/ArticleCard";
import { FavoriteService } from "@bundle:com.wanandroid.harmony/entry/ets/common/favorite/FavoriteService";
import { PagedListView } from "@bundle:com.wanandroid.harmony/entry/ets/common/ui/components/PagedListView";
import { PageHeader } from "@bundle:com.wanandroid.harmony/entry/ets/common/ui/components/PageHeader";
import { StateView } from "@bundle:com.wanandroid.harmony/entry/ets/common/ui/components/StateView";
import { SearchViewModel } from "@bundle:com.wanandroid.harmony/entry/ets/features/search/SearchViewModel";
import type { HomeArticleItem } from '../home/HomeRepository';
import type { HotKeyItem } from './SearchRepository';
export class SearchPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.onBack = undefined;
        this.onOpenLink = undefined;
        this.__vm = new ObservedPropertyObjectPU(new SearchViewModel(), this, "vm");
        this.__favoriteVersion = new ObservedPropertySimplePU(0, this, "favoriteVersion");
        this.favoriteListener = (): void => {
            this.favoriteVersion++;
        };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: SearchPage_Params) {
        if (params.onBack !== undefined) {
            this.onBack = params.onBack;
        }
        if (params.onOpenLink !== undefined) {
            this.onOpenLink = params.onOpenLink;
        }
        if (params.vm !== undefined) {
            this.vm = params.vm;
        }
        if (params.favoriteVersion !== undefined) {
            this.favoriteVersion = params.favoriteVersion;
        }
        if (params.favoriteListener !== undefined) {
            this.favoriteListener = params.favoriteListener;
        }
    }
    updateStateVars(params: SearchPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__vm.purgeDependencyOnElmtId(rmElmtId);
        this.__favoriteVersion.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__vm.aboutToBeDeleted();
        this.__favoriteVersion.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private onBack?: () => void;
    private onOpenLink?: (url: string) => void;
    private __vm: ObservedPropertyObjectPU<SearchViewModel>;
    get vm() {
        return this.__vm.get();
    }
    set vm(newValue: SearchViewModel) {
        this.__vm.set(newValue);
    }
    private __favoriteVersion: ObservedPropertySimplePU<number>;
    get favoriteVersion() {
        return this.__favoriteVersion.get();
    }
    set favoriteVersion(newValue: number) {
        this.__favoriteVersion.set(newValue);
    }
    private readonly favoriteListener;
    aboutToAppear(): void {
        FavoriteService.shared().subscribe(this.favoriteListener);
        this.initPage();
    }
    aboutToDisappear(): void {
        FavoriteService.shared().unsubscribe(this.favoriteListener);
    }
    private async initPage(): Promise<void> {
        await this.vm.init();
        this.vm = this.vm;
    }
    private async doSearch(): Promise<void> {
        await this.vm.search(this.vm.keyword);
        this.vm = this.vm;
    }
    private async onLoadMore(): Promise<void> {
        await this.vm.loadMore();
        this.vm = this.vm;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F5F6F8');
        }, Column);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new PageHeader(this, {
                        title: '搜索',
                        showBack: true,
                        onBack: () => {
                            if (this.onBack) {
                                this.onBack();
                            }
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/features/search/SearchPage.ets", line: 46, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            title: '搜索',
                            showBack: true,
                            onBack: () => {
                                if (this.onBack) {
                                    this.onBack();
                                }
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        title: '搜索',
                        showBack: true
                    });
                }
            }, { name: "PageHeader" });
        }
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
            Row.padding(12);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '输入关键词', text: this.vm.keyword });
            TextInput.layoutWeight(1);
            TextInput.onChange((value: string) => {
                this.vm.keyword = value;
                this.vm = this.vm;
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('搜索');
            Button.onClick(() => this.doSearch());
        }, Button);
        Button.pop();
        Row.pop();
        this.hotKeySection.bind(this)();
        this.historySection.bind(this)();
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new PagedListView(this, {
                        status: this.vm.resultState.status,
                        message: this.vm.resultState.message,
                        retryAction: () => this.doSearch(),
                        showLoadMore: this.vm.canLoadMore(),
                        isLoadingMore: this.vm.isLoadingMore,
                        loadMoreAction: () => this.onLoadMore(),
                        content: () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                ForEach.create();
                                const forEachItemGenFunction = _item => {
                                    const item = _item;
                                    {
                                        const itemCreation = (elmtId, isInitialRender) => {
                                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                            ListItem.create(deepRenderFunction, true);
                                            if (!isInitialRender) {
                                                ListItem.pop();
                                            }
                                            ViewStackProcessor.StopGetAccessRecording();
                                        };
                                        const itemCreation2 = (elmtId, isInitialRender) => {
                                            ListItem.create(deepRenderFunction, true);
                                        };
                                        const deepRenderFunction = (elmtId, isInitialRender) => {
                                            itemCreation(elmtId, isInitialRender);
                                            {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    if (isInitialRender) {
                                                        let componentCall = new ArticleCard(this, {
                                                            article: {
                                                                id: item.id,
                                                                title: item.title,
                                                                author: item.author,
                                                                shareUser: item.shareUser,
                                                                niceDate: item.niceDate
                                                            },
                                                            collected: FavoriteService.shared().isCollected(item.id),
                                                            showCollectAction: true,
                                                            clickAction: () => {
                                                                if (this.onOpenLink) {
                                                                    this.onOpenLink(item.link);
                                                                }
                                                            },
                                                            toggleCollectAction: async () => {
                                                                await FavoriteService.shared().toggle(item.id);
                                                                this.favoriteVersion++;
                                                            }
                                                        }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/features/search/SearchPage.ets", line: 81, col: 13 });
                                                        ViewPU.create(componentCall);
                                                        let paramsLambda = () => {
                                                            return {
                                                                article: {
                                                                    id: item.id,
                                                                    title: item.title,
                                                                    author: item.author,
                                                                    shareUser: item.shareUser,
                                                                    niceDate: item.niceDate
                                                                },
                                                                collected: FavoriteService.shared().isCollected(item.id),
                                                                showCollectAction: true,
                                                                clickAction: () => {
                                                                    if (this.onOpenLink) {
                                                                        this.onOpenLink(item.link);
                                                                    }
                                                                },
                                                                toggleCollectAction: async () => {
                                                                    await FavoriteService.shared().toggle(item.id);
                                                                    this.favoriteVersion++;
                                                                }
                                                            };
                                                        };
                                                        componentCall.paramsGenerator_ = paramsLambda;
                                                    }
                                                    else {
                                                        this.updateStateVarsOfChildByElmtId(elmtId, {
                                                            article: {
                                                                id: item.id,
                                                                title: item.title,
                                                                author: item.author,
                                                                shareUser: item.shareUser,
                                                                niceDate: item.niceDate
                                                            },
                                                            collected: FavoriteService.shared().isCollected(item.id),
                                                            showCollectAction: true
                                                        });
                                                    }
                                                }, { name: "ArticleCard" });
                                            }
                                            ListItem.pop();
                                        };
                                        this.observeComponentCreation2(itemCreation2, ListItem);
                                        ListItem.pop();
                                    }
                                };
                                this.forEachUpdateFunction(elmtId, this.vm.resultState.data || [], forEachItemGenFunction, (item: HomeArticleItem) => item.id.toString(), false, false);
                            }, ForEach);
                            ForEach.pop();
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/features/search/SearchPage.ets", line: 71, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            status: this.vm.resultState.status,
                            message: this.vm.resultState.message,
                            retryAction: () => this.doSearch(),
                            showLoadMore: this.vm.canLoadMore(),
                            isLoadingMore: this.vm.isLoadingMore,
                            loadMoreAction: () => this.onLoadMore(),
                            content: () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    ForEach.create();
                                    const forEachItemGenFunction = _item => {
                                        const item = _item;
                                        {
                                            const itemCreation = (elmtId, isInitialRender) => {
                                                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                                ListItem.create(deepRenderFunction, true);
                                                if (!isInitialRender) {
                                                    ListItem.pop();
                                                }
                                                ViewStackProcessor.StopGetAccessRecording();
                                            };
                                            const itemCreation2 = (elmtId, isInitialRender) => {
                                                ListItem.create(deepRenderFunction, true);
                                            };
                                            const deepRenderFunction = (elmtId, isInitialRender) => {
                                                itemCreation(elmtId, isInitialRender);
                                                {
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        if (isInitialRender) {
                                                            let componentCall = new ArticleCard(this, {
                                                                article: {
                                                                    id: item.id,
                                                                    title: item.title,
                                                                    author: item.author,
                                                                    shareUser: item.shareUser,
                                                                    niceDate: item.niceDate
                                                                },
                                                                collected: FavoriteService.shared().isCollected(item.id),
                                                                showCollectAction: true,
                                                                clickAction: () => {
                                                                    if (this.onOpenLink) {
                                                                        this.onOpenLink(item.link);
                                                                    }
                                                                },
                                                                toggleCollectAction: async () => {
                                                                    await FavoriteService.shared().toggle(item.id);
                                                                    this.favoriteVersion++;
                                                                }
                                                            }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/features/search/SearchPage.ets", line: 81, col: 13 });
                                                            ViewPU.create(componentCall);
                                                            let paramsLambda = () => {
                                                                return {
                                                                    article: {
                                                                        id: item.id,
                                                                        title: item.title,
                                                                        author: item.author,
                                                                        shareUser: item.shareUser,
                                                                        niceDate: item.niceDate
                                                                    },
                                                                    collected: FavoriteService.shared().isCollected(item.id),
                                                                    showCollectAction: true,
                                                                    clickAction: () => {
                                                                        if (this.onOpenLink) {
                                                                            this.onOpenLink(item.link);
                                                                        }
                                                                    },
                                                                    toggleCollectAction: async () => {
                                                                        await FavoriteService.shared().toggle(item.id);
                                                                        this.favoriteVersion++;
                                                                    }
                                                                };
                                                            };
                                                            componentCall.paramsGenerator_ = paramsLambda;
                                                        }
                                                        else {
                                                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                                                article: {
                                                                    id: item.id,
                                                                    title: item.title,
                                                                    author: item.author,
                                                                    shareUser: item.shareUser,
                                                                    niceDate: item.niceDate
                                                                },
                                                                collected: FavoriteService.shared().isCollected(item.id),
                                                                showCollectAction: true
                                                            });
                                                        }
                                                    }, { name: "ArticleCard" });
                                                }
                                                ListItem.pop();
                                            };
                                            this.observeComponentCreation2(itemCreation2, ListItem);
                                            ListItem.pop();
                                        }
                                    };
                                    this.forEachUpdateFunction(elmtId, this.vm.resultState.data || [], forEachItemGenFunction, (item: HomeArticleItem) => item.id.toString(), false, false);
                                }, ForEach);
                                ForEach.pop();
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        status: this.vm.resultState.status,
                        message: this.vm.resultState.message,
                        showLoadMore: this.vm.canLoadMore(),
                        isLoadingMore: this.vm.isLoadingMore
                    });
                }
            }, { name: "PagedListView" });
        }
        Column.pop();
    }
    private hotKeySection(parent = null) {
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new StateView(this, {
                        status: this.vm.hotKeysState.status,
                        message: this.vm.hotKeysState.message,
                        retryAction: () => this.initPage(),
                        content: () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Column.create();
                            }, Column);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create('热词');
                                Text.fontSize(13);
                                Text.fontWeight(FontWeight.Medium);
                                Text.width('100%');
                                Text.padding({ left: 12, right: 12, top: 4, bottom: 6 });
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Scroll.create();
                                Scroll.scrollable(ScrollDirection.Horizontal);
                            }, Scroll);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create({ space: 8 });
                                Row.padding({ left: 12, right: 12, bottom: 8 });
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                ForEach.create();
                                const forEachItemGenFunction = _item => {
                                    const item = _item;
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Button.createWithLabel(item.name);
                                        Button.type(ButtonType.Capsule);
                                        Button.onClick(async () => {
                                            this.vm.keyword = item.name;
                                            await this.doSearch();
                                        });
                                    }, Button);
                                    Button.pop();
                                };
                                this.forEachUpdateFunction(elmtId, this.vm.hotKeysState.data || [], forEachItemGenFunction, (item: HotKeyItem) => item.id.toString(), false, false);
                            }, ForEach);
                            ForEach.pop();
                            Row.pop();
                            Scroll.pop();
                            Column.pop();
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/features/search/SearchPage.ets", line: 112, col: 5 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            status: this.vm.hotKeysState.status,
                            message: this.vm.hotKeysState.message,
                            retryAction: () => this.initPage(),
                            content: () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Column.create();
                                }, Column);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('热词');
                                    Text.fontSize(13);
                                    Text.fontWeight(FontWeight.Medium);
                                    Text.width('100%');
                                    Text.padding({ left: 12, right: 12, top: 4, bottom: 6 });
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Scroll.create();
                                    Scroll.scrollable(ScrollDirection.Horizontal);
                                }, Scroll);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create({ space: 8 });
                                    Row.padding({ left: 12, right: 12, bottom: 8 });
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    ForEach.create();
                                    const forEachItemGenFunction = _item => {
                                        const item = _item;
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Button.createWithLabel(item.name);
                                            Button.type(ButtonType.Capsule);
                                            Button.onClick(async () => {
                                                this.vm.keyword = item.name;
                                                await this.doSearch();
                                            });
                                        }, Button);
                                        Button.pop();
                                    };
                                    this.forEachUpdateFunction(elmtId, this.vm.hotKeysState.data || [], forEachItemGenFunction, (item: HotKeyItem) => item.id.toString(), false, false);
                                }, ForEach);
                                ForEach.pop();
                                Row.pop();
                                Scroll.pop();
                                Column.pop();
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        status: this.vm.hotKeysState.status,
                        message: this.vm.hotKeysState.message
                    });
                }
            }, { name: "StateView" });
        }
    }
    private historySection(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.vm.history.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('历史搜索');
                        Text.fontSize(13);
                        Text.fontWeight(FontWeight.Medium);
                        Text.width('100%');
                        Text.padding({ left: 12, right: 12, top: 4, bottom: 6 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Scroll.create();
                        Scroll.scrollable(ScrollDirection.Horizontal);
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 8 });
                        Row.padding({ left: 12, right: 12, bottom: 8 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const item = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Button.createWithLabel(item);
                                Button.type(ButtonType.Capsule);
                                Button.onClick(async () => {
                                    this.vm.keyword = item;
                                    await this.doSearch();
                                });
                            }, Button);
                            Button.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.vm.history, forEachItemGenFunction, (item: string) => item, false, false);
                    }, ForEach);
                    ForEach.pop();
                    Row.pop();
                    Scroll.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
