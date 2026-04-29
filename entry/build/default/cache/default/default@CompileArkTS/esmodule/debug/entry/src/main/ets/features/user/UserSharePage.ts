if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface UserSharePage_Params {
    userId?: number;
    username?: string;
    onBack?: () => void;
    onOpenLink?: (url: string) => void;
    vm?: UserShareViewModel;
    favoriteVersion?: number;
    favoriteListener?;
}
import { ArticleCard } from "@bundle:com.wanandroid.harmony/entry/ets/common/ui/components/ArticleCard";
import { FavoriteService } from "@bundle:com.wanandroid.harmony/entry/ets/common/favorite/FavoriteService";
import { PageHeader } from "@bundle:com.wanandroid.harmony/entry/ets/common/ui/components/PageHeader";
import { UiTheme } from "@bundle:com.wanandroid.harmony/entry/ets/common/ui/UiTheme";
import { PagedListView } from "@bundle:com.wanandroid.harmony/entry/ets/common/ui/components/PagedListView";
import { UserShareViewModel } from "@bundle:com.wanandroid.harmony/entry/ets/features/user/UserShareViewModel";
import type { UserShareArticle } from './UserShareRepository';
export class UserSharePage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__userId = new SynchedPropertySimpleOneWayPU(params.userId, this, "userId");
        this.__username = new SynchedPropertySimpleOneWayPU(params.username, this, "username");
        this.onBack = undefined;
        this.onOpenLink = undefined;
        this.__vm = new ObservedPropertyObjectPU(new UserShareViewModel(), this, "vm");
        this.__favoriteVersion = new ObservedPropertySimplePU(0, this, "favoriteVersion");
        this.favoriteListener = (): void => {
            this.favoriteVersion++;
        };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: UserSharePage_Params) {
        if (params.userId === undefined) {
            this.__userId.set(0);
        }
        if (params.username === undefined) {
            this.__username.set('分享人');
        }
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
    updateStateVars(params: UserSharePage_Params) {
        this.__userId.reset(params.userId);
        this.__username.reset(params.username);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__userId.purgeDependencyOnElmtId(rmElmtId);
        this.__username.purgeDependencyOnElmtId(rmElmtId);
        this.__vm.purgeDependencyOnElmtId(rmElmtId);
        this.__favoriteVersion.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__userId.aboutToBeDeleted();
        this.__username.aboutToBeDeleted();
        this.__vm.aboutToBeDeleted();
        this.__favoriteVersion.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __userId: SynchedPropertySimpleOneWayPU<number>;
    get userId() {
        return this.__userId.get();
    }
    set userId(newValue: number) {
        this.__userId.set(newValue);
    }
    private __username: SynchedPropertySimpleOneWayPU<string>;
    get username() {
        return this.__username.get();
    }
    set username(newValue: string) {
        this.__username.set(newValue);
    }
    private onBack?: () => void;
    private onOpenLink?: (url: string) => void;
    private __vm: ObservedPropertyObjectPU<UserShareViewModel>;
    get vm() {
        return this.__vm.get();
    }
    set vm(newValue: UserShareViewModel) {
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
        await this.vm.loadFirstPage(this.userId);
        this.vm = this.vm;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(UiTheme.BG_PAGE);
        }, Column);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new PageHeader(this, {
                        title: `${this.username} 的分享`,
                        showBack: true,
                        onBack: () => {
                            if (this.onBack) {
                                this.onBack();
                            }
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/features/user/UserSharePage.ets", line: 38, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            title: `${this.username} 的分享`,
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
                        title: `${this.username} 的分享`,
                        showBack: true
                    });
                }
            }, { name: "PageHeader" });
        }
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.vm.coinInfo) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.userInfoCard.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new PagedListView(this, {
                        status: this.vm.state.status,
                        message: this.vm.state.message,
                        retryAction: async () => {
                            await this.vm.loadFirstPage(this.userId);
                            this.vm = this.vm;
                        },
                        showLoadMore: this.vm.canLoadMore(),
                        isLoadingMore: this.vm.isLoadingMore,
                        loadMoreAction: async () => {
                            await this.vm.loadMore(this.userId);
                            this.vm = this.vm;
                        },
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
                                                        }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/features/user/UserSharePage.ets", line: 68, col: 13 });
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
                                this.forEachUpdateFunction(elmtId, this.vm.state.data || [], forEachItemGenFunction, (item: UserShareArticle) => item.id.toString(), false, false);
                            }, ForEach);
                            ForEach.pop();
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/features/user/UserSharePage.ets", line: 52, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            status: this.vm.state.status,
                            message: this.vm.state.message,
                            retryAction: async () => {
                                await this.vm.loadFirstPage(this.userId);
                                this.vm = this.vm;
                            },
                            showLoadMore: this.vm.canLoadMore(),
                            isLoadingMore: this.vm.isLoadingMore,
                            loadMoreAction: async () => {
                                await this.vm.loadMore(this.userId);
                                this.vm = this.vm;
                            },
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
                                                            }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/features/user/UserSharePage.ets", line: 68, col: 13 });
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
                                    this.forEachUpdateFunction(elmtId, this.vm.state.data || [], forEachItemGenFunction, (item: UserShareArticle) => item.id.toString(), false, false);
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
    private userInfoCard(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.vm.coinInfo) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 6 });
                        Column.width('100%');
                        Column.padding(12);
                        Column.margin({ left: 12, right: 12, bottom: 8 });
                        Column.backgroundColor(UiTheme.BG_CARD);
                        Column.borderRadius(10);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.vm.coinInfo.username || this.username);
                        Text.fontSize(16);
                        Text.fontWeight(FontWeight.Medium);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`用户ID：${this.vm.coinInfo.userId}`);
                        Text.fontSize(12);
                        Text.fontColor(UiTheme.TEXT_SECONDARY);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`积分：${this.vm.coinInfo.coinCount}  排名：${this.vm.coinInfo.rank}`);
                        Text.fontSize(12);
                        Text.fontColor('#333333');
                    }, Text);
                    Text.pop();
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
