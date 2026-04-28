if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface HomePage_Params {
    onOpenSearch?: () => void;
    onOpenLink?: (url: string) => void;
    vm?: HomeViewModel;
    favoriteVersion?: number;
    favoriteListener?;
}
import { ArticleCard } from "@bundle:com.wanandroid.harmony/entry/ets/common/ui/components/ArticleCard";
import { FavoriteService } from "@bundle:com.wanandroid.harmony/entry/ets/common/favorite/FavoriteService";
import { PagedListView } from "@bundle:com.wanandroid.harmony/entry/ets/common/ui/components/PagedListView";
import { PageHeader } from "@bundle:com.wanandroid.harmony/entry/ets/common/ui/components/PageHeader";
import { HomeViewModel } from "@bundle:com.wanandroid.harmony/entry/ets/features/home/HomeViewModel";
import type { HomeArticleItem } from './HomeRepository';
export class HomePage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.onOpenSearch = undefined;
        this.onOpenLink = undefined;
        this.__vm = new ObservedPropertyObjectPU(new HomeViewModel(), this, "vm");
        this.__favoriteVersion = new ObservedPropertySimplePU(0, this, "favoriteVersion");
        this.favoriteListener = (): void => {
            this.favoriteVersion++;
        };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: HomePage_Params) {
        if (params.onOpenSearch !== undefined) {
            this.onOpenSearch = params.onOpenSearch;
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
    updateStateVars(params: HomePage_Params) {
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
    private onOpenSearch?: () => void;
    private onOpenLink?: (url: string) => void;
    private __vm: ObservedPropertyObjectPU<HomeViewModel>;
    get vm() {
        return this.__vm.get();
    }
    set vm(newValue: HomeViewModel) {
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
    private async onRetry(): Promise<void> {
        await this.vm.refresh();
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
                        title: '首页',
                        rightText: '搜索',
                        onRightClick: () => {
                            if (this.onOpenSearch) {
                                this.onOpenSearch();
                            }
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/features/home/HomePage.ets", line: 44, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            title: '首页',
                            rightText: '搜索',
                            onRightClick: () => {
                                if (this.onOpenSearch) {
                                    this.onOpenSearch();
                                }
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        title: '首页',
                        rightText: '搜索'
                    });
                }
            }, { name: "PageHeader" });
        }
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new PagedListView(this, {
                        status: this.vm.state.status,
                        message: this.vm.state.message,
                        retryAction: () => this.onRetry(),
                        showLoadMore: this.vm.canLoadMore(),
                        isLoadingMore: this.vm.isLoadingMore,
                        loadMoreAction: () => this.onLoadMore(),
                        content: () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                If.create();
                                if (this.vm.banners.length > 0) {
                                    this.ifElseBranchUpdateFunction(0, () => {
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
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create(`Banner：${this.vm.banners.length} 条`);
                                                    Text.fontSize(14);
                                                    Text.padding(12);
                                                    Text.backgroundColor('#EAF2FF');
                                                    Text.borderRadius(8);
                                                }, Text);
                                                Text.pop();
                                                ListItem.pop();
                                            };
                                            this.observeComponentCreation2(itemCreation2, ListItem);
                                            ListItem.pop();
                                        }
                                    });
                                }
                                else {
                                    this.ifElseBranchUpdateFunction(1, () => {
                                    });
                                }
                            }, If);
                            If.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                If.create();
                                if (this.vm.topArticles.length > 0) {
                                    this.ifElseBranchUpdateFunction(0, () => {
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
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create(`置顶：${this.vm.topArticles.length} 条`);
                                                    Text.fontSize(14);
                                                    Text.padding(12);
                                                    Text.backgroundColor('#F3F7E8');
                                                    Text.borderRadius(8);
                                                }, Text);
                                                Text.pop();
                                                ListItem.pop();
                                            };
                                            this.observeComponentCreation2(itemCreation2, ListItem);
                                            ListItem.pop();
                                        }
                                    });
                                }
                                else {
                                    this.ifElseBranchUpdateFunction(1, () => {
                                    });
                                }
                            }, If);
                            If.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                If.create();
                                if (this.vm.harmony !== null) {
                                    this.ifElseBranchUpdateFunction(0, () => {
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
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create('鸿蒙专栏：links / open_sources / tools');
                                                    Text.fontSize(14);
                                                    Text.padding(12);
                                                    Text.backgroundColor('#FFF6E5');
                                                    Text.borderRadius(8);
                                                }, Text);
                                                Text.pop();
                                                ListItem.pop();
                                            };
                                            this.observeComponentCreation2(itemCreation2, ListItem);
                                            ListItem.pop();
                                        }
                                    });
                                }
                                else {
                                    this.ifElseBranchUpdateFunction(1, () => {
                                    });
                                }
                            }, If);
                            If.pop();
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
                                                        }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/features/home/HomePage.ets", line: 94, col: 13 });
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
                                this.forEachUpdateFunction(elmtId, this.vm.state.data || [], forEachItemGenFunction, (item: HomeArticleItem) => item.id.toString(), false, false);
                            }, ForEach);
                            ForEach.pop();
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/features/home/HomePage.ets", line: 54, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            status: this.vm.state.status,
                            message: this.vm.state.message,
                            retryAction: () => this.onRetry(),
                            showLoadMore: this.vm.canLoadMore(),
                            isLoadingMore: this.vm.isLoadingMore,
                            loadMoreAction: () => this.onLoadMore(),
                            content: () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    If.create();
                                    if (this.vm.banners.length > 0) {
                                        this.ifElseBranchUpdateFunction(0, () => {
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
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Text.create(`Banner：${this.vm.banners.length} 条`);
                                                        Text.fontSize(14);
                                                        Text.padding(12);
                                                        Text.backgroundColor('#EAF2FF');
                                                        Text.borderRadius(8);
                                                    }, Text);
                                                    Text.pop();
                                                    ListItem.pop();
                                                };
                                                this.observeComponentCreation2(itemCreation2, ListItem);
                                                ListItem.pop();
                                            }
                                        });
                                    }
                                    else {
                                        this.ifElseBranchUpdateFunction(1, () => {
                                        });
                                    }
                                }, If);
                                If.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    If.create();
                                    if (this.vm.topArticles.length > 0) {
                                        this.ifElseBranchUpdateFunction(0, () => {
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
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Text.create(`置顶：${this.vm.topArticles.length} 条`);
                                                        Text.fontSize(14);
                                                        Text.padding(12);
                                                        Text.backgroundColor('#F3F7E8');
                                                        Text.borderRadius(8);
                                                    }, Text);
                                                    Text.pop();
                                                    ListItem.pop();
                                                };
                                                this.observeComponentCreation2(itemCreation2, ListItem);
                                                ListItem.pop();
                                            }
                                        });
                                    }
                                    else {
                                        this.ifElseBranchUpdateFunction(1, () => {
                                        });
                                    }
                                }, If);
                                If.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    If.create();
                                    if (this.vm.harmony !== null) {
                                        this.ifElseBranchUpdateFunction(0, () => {
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
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Text.create('鸿蒙专栏：links / open_sources / tools');
                                                        Text.fontSize(14);
                                                        Text.padding(12);
                                                        Text.backgroundColor('#FFF6E5');
                                                        Text.borderRadius(8);
                                                    }, Text);
                                                    Text.pop();
                                                    ListItem.pop();
                                                };
                                                this.observeComponentCreation2(itemCreation2, ListItem);
                                                ListItem.pop();
                                            }
                                        });
                                    }
                                    else {
                                        this.ifElseBranchUpdateFunction(1, () => {
                                        });
                                    }
                                }, If);
                                If.pop();
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
                                                            }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/features/home/HomePage.ets", line: 94, col: 13 });
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
                                    this.forEachUpdateFunction(elmtId, this.vm.state.data || [], forEachItemGenFunction, (item: HomeArticleItem) => item.id.toString(), false, false);
                                }, ForEach);
                                ForEach.pop();
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        status: this.vm.state.status,
                        message: this.vm.state.message,
                        showLoadMore: this.vm.canLoadMore(),
                        isLoadingMore: this.vm.isLoadingMore
                    });
                }
            }, { name: "PagedListView" });
        }
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
