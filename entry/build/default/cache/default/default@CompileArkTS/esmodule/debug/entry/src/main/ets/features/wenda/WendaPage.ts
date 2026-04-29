if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface WendaPage_Params {
    onOpenLink?: (url: string) => void;
    onOpenUserShare?: (userId: number, username: string) => void;
    vm?: WendaViewModel;
    showComments?: boolean;
    selectedTitle?: string;
    selectedWendaId?: number;
    commentActionTip?: string;
    favoriteVersion?: number;
    favoriteListener?;
}
import { ArticleCard } from "@bundle:com.wanandroid.harmony/entry/ets/common/ui/components/ArticleCard";
import { FavoriteService } from "@bundle:com.wanandroid.harmony/entry/ets/common/favorite/FavoriteService";
import { PagedListView } from "@bundle:com.wanandroid.harmony/entry/ets/common/ui/components/PagedListView";
import { PageHeader } from "@bundle:com.wanandroid.harmony/entry/ets/common/ui/components/PageHeader";
import { UiTheme } from "@bundle:com.wanandroid.harmony/entry/ets/common/ui/UiTheme";
import { StateView } from "@bundle:com.wanandroid.harmony/entry/ets/common/ui/components/StateView";
import { WendaViewModel } from "@bundle:com.wanandroid.harmony/entry/ets/features/wenda/WendaViewModel";
import type { WendaComment, WendaItem } from './WendaRepository';
export class WendaPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.onOpenLink = undefined;
        this.onOpenUserShare = undefined;
        this.__vm = new ObservedPropertyObjectPU(new WendaViewModel(), this, "vm");
        this.__showComments = new ObservedPropertySimplePU(false, this, "showComments");
        this.__selectedTitle = new ObservedPropertySimplePU('', this, "selectedTitle");
        this.__selectedWendaId = new ObservedPropertySimplePU(0, this, "selectedWendaId");
        this.__commentActionTip = new ObservedPropertySimplePU('', this, "commentActionTip");
        this.__favoriteVersion = new ObservedPropertySimplePU(0, this, "favoriteVersion");
        this.favoriteListener = (): void => {
            this.favoriteVersion++;
        };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: WendaPage_Params) {
        if (params.onOpenLink !== undefined) {
            this.onOpenLink = params.onOpenLink;
        }
        if (params.onOpenUserShare !== undefined) {
            this.onOpenUserShare = params.onOpenUserShare;
        }
        if (params.vm !== undefined) {
            this.vm = params.vm;
        }
        if (params.showComments !== undefined) {
            this.showComments = params.showComments;
        }
        if (params.selectedTitle !== undefined) {
            this.selectedTitle = params.selectedTitle;
        }
        if (params.selectedWendaId !== undefined) {
            this.selectedWendaId = params.selectedWendaId;
        }
        if (params.commentActionTip !== undefined) {
            this.commentActionTip = params.commentActionTip;
        }
        if (params.favoriteVersion !== undefined) {
            this.favoriteVersion = params.favoriteVersion;
        }
        if (params.favoriteListener !== undefined) {
            this.favoriteListener = params.favoriteListener;
        }
    }
    updateStateVars(params: WendaPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__vm.purgeDependencyOnElmtId(rmElmtId);
        this.__showComments.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedTitle.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedWendaId.purgeDependencyOnElmtId(rmElmtId);
        this.__commentActionTip.purgeDependencyOnElmtId(rmElmtId);
        this.__favoriteVersion.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__vm.aboutToBeDeleted();
        this.__showComments.aboutToBeDeleted();
        this.__selectedTitle.aboutToBeDeleted();
        this.__selectedWendaId.aboutToBeDeleted();
        this.__commentActionTip.aboutToBeDeleted();
        this.__favoriteVersion.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private onOpenLink?: (url: string) => void;
    private onOpenUserShare?: (userId: number, username: string) => void;
    private __vm: ObservedPropertyObjectPU<WendaViewModel>;
    get vm() {
        return this.__vm.get();
    }
    set vm(newValue: WendaViewModel) {
        this.__vm.set(newValue);
    }
    private __showComments: ObservedPropertySimplePU<boolean>;
    get showComments() {
        return this.__showComments.get();
    }
    set showComments(newValue: boolean) {
        this.__showComments.set(newValue);
    }
    private __selectedTitle: ObservedPropertySimplePU<string>;
    get selectedTitle() {
        return this.__selectedTitle.get();
    }
    set selectedTitle(newValue: string) {
        this.__selectedTitle.set(newValue);
    }
    private __selectedWendaId: ObservedPropertySimplePU<number>;
    get selectedWendaId() {
        return this.__selectedWendaId.get();
    }
    set selectedWendaId(newValue: number) {
        this.__selectedWendaId.set(newValue);
    }
    private __commentActionTip: ObservedPropertySimplePU<string>;
    get commentActionTip() {
        return this.__commentActionTip.get();
    }
    set commentActionTip(newValue: string) {
        this.__commentActionTip.set(newValue);
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
                    let componentCall = new PageHeader(this, { title: this.showComments ? '问答评论' : '问答' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/features/wenda/WendaPage.ets", line: 40, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            title: this.showComments ? '问答评论' : '问答'
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        title: this.showComments ? '问答评论' : '问答'
                    });
                }
            }, { name: "PageHeader" });
        }
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.showComments) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.commentArea.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.wendaList.bind(this)();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    private wendaList(parent = null) {
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new PagedListView(this, {
                        status: this.vm.wendaState.status,
                        message: this.vm.wendaState.message,
                        retryAction: async () => {
                            await this.vm.loadWendaFirstPage();
                            this.vm = this.vm;
                        },
                        showLoadMore: this.vm.canLoadMore(),
                        isLoadingMore: this.vm.isLoadingMore,
                        loadMoreAction: async () => {
                            await this.vm.loadMore();
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
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Column.create();
                                            }, Column);
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
                                                        }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/features/wenda/WendaPage.ets", line: 72, col: 13 });
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
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Button.createWithLabel('查看评论');
                                                Button.type(ButtonType.Capsule);
                                                Button.margin({ top: 6 });
                                                Button.onClick(async () => {
                                                    this.selectedWendaId = item.id;
                                                    this.selectedTitle = item.title;
                                                    await this.vm.loadComments(item.id);
                                                    this.showComments = true;
                                                    this.vm = this.vm;
                                                });
                                            }, Button);
                                            Button.pop();
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                If.create();
                                                if (item.userId && item.userId > 0) {
                                                    this.ifElseBranchUpdateFunction(0, () => {
                                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                            Button.createWithLabel('分享人主页');
                                                            Button.type(ButtonType.Capsule);
                                                            Button.margin({ top: 6 });
                                                            Button.onClick(() => {
                                                                if (this.onOpenUserShare) {
                                                                    this.onOpenUserShare(item.userId || 0, item.shareUser || item.author || '分享人');
                                                                }
                                                            });
                                                        }, Button);
                                                        Button.pop();
                                                    });
                                                }
                                                else {
                                                    this.ifElseBranchUpdateFunction(1, () => {
                                                    });
                                                }
                                            }, If);
                                            If.pop();
                                            Column.pop();
                                            ListItem.pop();
                                        };
                                        this.observeComponentCreation2(itemCreation2, ListItem);
                                        ListItem.pop();
                                    }
                                };
                                this.forEachUpdateFunction(elmtId, this.vm.wendaState.data || [], forEachItemGenFunction, (item: WendaItem) => item.id.toString(), false, false);
                            }, ForEach);
                            ForEach.pop();
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/features/wenda/WendaPage.ets", line: 55, col: 5 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            status: this.vm.wendaState.status,
                            message: this.vm.wendaState.message,
                            retryAction: async () => {
                                await this.vm.loadWendaFirstPage();
                                this.vm = this.vm;
                            },
                            showLoadMore: this.vm.canLoadMore(),
                            isLoadingMore: this.vm.isLoadingMore,
                            loadMoreAction: async () => {
                                await this.vm.loadMore();
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
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Column.create();
                                                }, Column);
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
                                                            }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/features/wenda/WendaPage.ets", line: 72, col: 13 });
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
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Button.createWithLabel('查看评论');
                                                    Button.type(ButtonType.Capsule);
                                                    Button.margin({ top: 6 });
                                                    Button.onClick(async () => {
                                                        this.selectedWendaId = item.id;
                                                        this.selectedTitle = item.title;
                                                        await this.vm.loadComments(item.id);
                                                        this.showComments = true;
                                                        this.vm = this.vm;
                                                    });
                                                }, Button);
                                                Button.pop();
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    If.create();
                                                    if (item.userId && item.userId > 0) {
                                                        this.ifElseBranchUpdateFunction(0, () => {
                                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                                Button.createWithLabel('分享人主页');
                                                                Button.type(ButtonType.Capsule);
                                                                Button.margin({ top: 6 });
                                                                Button.onClick(() => {
                                                                    if (this.onOpenUserShare) {
                                                                        this.onOpenUserShare(item.userId || 0, item.shareUser || item.author || '分享人');
                                                                    }
                                                                });
                                                            }, Button);
                                                            Button.pop();
                                                        });
                                                    }
                                                    else {
                                                        this.ifElseBranchUpdateFunction(1, () => {
                                                        });
                                                    }
                                                }, If);
                                                If.pop();
                                                Column.pop();
                                                ListItem.pop();
                                            };
                                            this.observeComponentCreation2(itemCreation2, ListItem);
                                            ListItem.pop();
                                        }
                                    };
                                    this.forEachUpdateFunction(elmtId, this.vm.wendaState.data || [], forEachItemGenFunction, (item: WendaItem) => item.id.toString(), false, false);
                                }, ForEach);
                                ForEach.pop();
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        status: this.vm.wendaState.status,
                        message: this.vm.wendaState.message,
                        showLoadMore: this.vm.canLoadMore(),
                        isLoadingMore: this.vm.isLoadingMore
                    });
                }
            }, { name: "PagedListView" });
        }
    }
    private commentArea(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.commentActionTip.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.commentActionTip);
                        Text.width('100%');
                        Text.fontSize(12);
                        Text.fontColor(UiTheme.TEXT_WARNING);
                        Text.padding({ left: 12, right: 12, top: 6, bottom: 6 });
                        Text.backgroundColor(UiTheme.BG_WARNING);
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ left: 12, right: 12, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('返回列表');
            Button.type(ButtonType.Capsule);
            Button.onClick(() => {
                this.showComments = false;
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.selectedTitle);
            Text.fontSize(13);
            Text.maxLines(1);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.margin({ left: 8 });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
            Row.width('100%');
            Row.padding({ left: 12, right: 12, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.vm.commentSortDesc ? '按点赞降序' : '按点赞升序');
            Button.type(ButtonType.Capsule);
            Button.onClick(() => {
                this.vm.toggleCommentSort();
                this.vm = this.vm;
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('刷新评论');
            Button.type(ButtonType.Capsule);
            Button.onClick(async () => {
                if (this.selectedWendaId > 0) {
                    await this.vm.loadComments(this.selectedWendaId);
                    this.vm = this.vm;
                }
            });
        }, Button);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(1);
        }, Column);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new StateView(this, {
                        status: this.vm.commentState.status,
                        message: this.vm.commentState.message,
                        content: () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                List.create({ space: 8 });
                                List.padding({ left: 12, right: 12, bottom: 12 });
                            }, List);
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
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Column.create();
                                                Column.width('100%');
                                                Column.padding(12);
                                                Column.backgroundColor(UiTheme.BG_CARD);
                                                Column.borderRadius(8);
                                            }, Column);
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Row.create();
                                                Row.width('100%');
                                            }, Row);
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Text.create(item.userName);
                                                Text.fontSize(13);
                                                Text.fontWeight(FontWeight.Medium);
                                            }, Text);
                                            Text.pop();
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Blank.create();
                                            }, Blank);
                                            Blank.pop();
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Text.create(`赞 ${item.zan}`);
                                                Text.fontSize(12);
                                                Text.fontColor(UiTheme.TEXT_SECONDARY);
                                            }, Text);
                                            Text.pop();
                                            Row.pop();
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Text.create(item.content);
                                                Text.fontSize(14);
                                                Text.margin({ top: 6 });
                                            }, Text);
                                            Text.pop();
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Text.create(item.niceDate);
                                                Text.fontSize(12);
                                                Text.fontColor(UiTheme.TEXT_TERTIARY);
                                                Text.margin({ top: 8 });
                                            }, Text);
                                            Text.pop();
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Row.create({ space: 8 });
                                                Row.margin({ top: 8 });
                                            }, Row);
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Button.createWithLabel('点赞（待开放）');
                                                Button.type(ButtonType.Capsule);
                                                Button.onClick(() => {
                                                    this.showCommentActionTip('点赞', item.id);
                                                });
                                            }, Button);
                                            Button.pop();
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Button.createWithLabel('回复（待开放）');
                                                Button.type(ButtonType.Capsule);
                                                Button.onClick(() => {
                                                    this.showCommentActionTip('回复', item.id);
                                                });
                                            }, Button);
                                            Button.pop();
                                            Row.pop();
                                            Column.pop();
                                            ListItem.pop();
                                        };
                                        this.observeComponentCreation2(itemCreation2, ListItem);
                                        ListItem.pop();
                                    }
                                };
                                this.forEachUpdateFunction(elmtId, this.vm.getSortedComments(), forEachItemGenFunction, (item: WendaComment) => item.id.toString(), false, false);
                            }, ForEach);
                            ForEach.pop();
                            List.pop();
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/features/wenda/WendaPage.ets", line: 165, col: 9 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            status: this.vm.commentState.status,
                            message: this.vm.commentState.message,
                            content: () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    List.create({ space: 8 });
                                    List.padding({ left: 12, right: 12, bottom: 12 });
                                }, List);
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
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Column.create();
                                                    Column.width('100%');
                                                    Column.padding(12);
                                                    Column.backgroundColor(UiTheme.BG_CARD);
                                                    Column.borderRadius(8);
                                                }, Column);
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Row.create();
                                                    Row.width('100%');
                                                }, Row);
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create(item.userName);
                                                    Text.fontSize(13);
                                                    Text.fontWeight(FontWeight.Medium);
                                                }, Text);
                                                Text.pop();
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Blank.create();
                                                }, Blank);
                                                Blank.pop();
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create(`赞 ${item.zan}`);
                                                    Text.fontSize(12);
                                                    Text.fontColor(UiTheme.TEXT_SECONDARY);
                                                }, Text);
                                                Text.pop();
                                                Row.pop();
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create(item.content);
                                                    Text.fontSize(14);
                                                    Text.margin({ top: 6 });
                                                }, Text);
                                                Text.pop();
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create(item.niceDate);
                                                    Text.fontSize(12);
                                                    Text.fontColor(UiTheme.TEXT_TERTIARY);
                                                    Text.margin({ top: 8 });
                                                }, Text);
                                                Text.pop();
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Row.create({ space: 8 });
                                                    Row.margin({ top: 8 });
                                                }, Row);
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Button.createWithLabel('点赞（待开放）');
                                                    Button.type(ButtonType.Capsule);
                                                    Button.onClick(() => {
                                                        this.showCommentActionTip('点赞', item.id);
                                                    });
                                                }, Button);
                                                Button.pop();
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Button.createWithLabel('回复（待开放）');
                                                    Button.type(ButtonType.Capsule);
                                                    Button.onClick(() => {
                                                        this.showCommentActionTip('回复', item.id);
                                                    });
                                                }, Button);
                                                Button.pop();
                                                Row.pop();
                                                Column.pop();
                                                ListItem.pop();
                                            };
                                            this.observeComponentCreation2(itemCreation2, ListItem);
                                            ListItem.pop();
                                        }
                                    };
                                    this.forEachUpdateFunction(elmtId, this.vm.getSortedComments(), forEachItemGenFunction, (item: WendaComment) => item.id.toString(), false, false);
                                }, ForEach);
                                ForEach.pop();
                                List.pop();
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        status: this.vm.commentState.status,
                        message: this.vm.commentState.message
                    });
                }
            }, { name: "StateView" });
        }
        Column.pop();
        Column.pop();
    }
    private showCommentActionTip(action: string, commentId: number): void {
        this.commentActionTip = `${action}功能规划中（评论ID: ${commentId}）`;
        setTimeout(() => {
            this.commentActionTip = '';
        }, 1500);
    }
    rerender() {
        this.updateDirtyElements();
    }
}
