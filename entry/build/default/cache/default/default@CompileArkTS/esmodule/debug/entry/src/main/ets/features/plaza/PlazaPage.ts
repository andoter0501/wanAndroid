if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface PlazaPage_Params {
    onOpenLink?: (url: string) => void;
    onOpenUserShare?: (userId: number, username: string) => void;
    vm?: PlazaViewModel;
    tab?: PlazaTab;
    favoriteVersion?: number;
    favoriteListener?;
}
import { ArticleCard } from "@bundle:com.wanandroid.harmony/entry/ets/common/ui/components/ArticleCard";
import { FavoriteService } from "@bundle:com.wanandroid.harmony/entry/ets/common/favorite/FavoriteService";
import { PagedListView } from "@bundle:com.wanandroid.harmony/entry/ets/common/ui/components/PagedListView";
import { PageHeader } from "@bundle:com.wanandroid.harmony/entry/ets/common/ui/components/PageHeader";
import { SessionStore } from "@bundle:com.wanandroid.harmony/entry/ets/common/storage/SessionStore";
import { PlazaViewModel } from "@bundle:com.wanandroid.harmony/entry/ets/features/plaza/PlazaViewModel";
import type { PlazaArticle } from './PlazaRepository';
enum PlazaTab {
    PLAZA = 0,
    MY_SHARE = 1
}
export class PlazaPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.onOpenLink = undefined;
        this.onOpenUserShare = undefined;
        this.__vm = new ObservedPropertyObjectPU(new PlazaViewModel(), this, "vm");
        this.__tab = new ObservedPropertySimplePU(PlazaTab.PLAZA, this, "tab");
        this.__favoriteVersion = new ObservedPropertySimplePU(0, this, "favoriteVersion");
        this.favoriteListener = (): void => {
            this.favoriteVersion++;
        };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: PlazaPage_Params) {
        if (params.onOpenLink !== undefined) {
            this.onOpenLink = params.onOpenLink;
        }
        if (params.onOpenUserShare !== undefined) {
            this.onOpenUserShare = params.onOpenUserShare;
        }
        if (params.vm !== undefined) {
            this.vm = params.vm;
        }
        if (params.tab !== undefined) {
            this.tab = params.tab;
        }
        if (params.favoriteVersion !== undefined) {
            this.favoriteVersion = params.favoriteVersion;
        }
        if (params.favoriteListener !== undefined) {
            this.favoriteListener = params.favoriteListener;
        }
    }
    updateStateVars(params: PlazaPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__vm.purgeDependencyOnElmtId(rmElmtId);
        this.__tab.purgeDependencyOnElmtId(rmElmtId);
        this.__favoriteVersion.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__vm.aboutToBeDeleted();
        this.__tab.aboutToBeDeleted();
        this.__favoriteVersion.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private onOpenLink?: (url: string) => void;
    private onOpenUserShare?: (userId: number, username: string) => void;
    private __vm: ObservedPropertyObjectPU<PlazaViewModel>;
    get vm() {
        return this.__vm.get();
    }
    set vm(newValue: PlazaViewModel) {
        this.__vm.set(newValue);
    }
    private __tab: ObservedPropertySimplePU<PlazaTab>;
    get tab() {
        return this.__tab.get();
    }
    set tab(newValue: PlazaTab) {
        this.__tab.set(newValue);
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
        if (SessionStore.shared().isLogin()) {
            await this.vm.loadMyShareFirstPage();
        }
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
                    let componentCall = new PageHeader(this, { title: '广场' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/features/plaza/PlazaPage.ets", line: 45, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            title: '广场'
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        title: '广场'
                    });
                }
            }, { name: "PageHeader" });
        }
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
            Row.width('100%');
            Row.padding({ left: 12, right: 12, bottom: 10 });
        }, Row);
        this.tabBtn.bind(this)('广场动态', PlazaTab.PLAZA);
        this.tabBtn.bind(this)('我的分享', PlazaTab.MY_SHARE);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.tab === PlazaTab.PLAZA) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.plazaList.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.myShareArea.bind(this)();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    private tabBtn(label: string, tab: PlazaTab, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(label);
            Button.type(this.tab === tab ? ButtonType.Capsule : ButtonType.Normal);
            Button.onClick(async () => {
                this.tab = tab;
                if (tab === PlazaTab.MY_SHARE && SessionStore.shared().isLogin()) {
                    await this.vm.loadMyShareFirstPage();
                    this.vm = this.vm;
                }
            });
        }, Button);
        Button.pop();
    }
    private plazaList(parent = null) {
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new PagedListView(this, {
                        status: this.vm.plazaState.status,
                        message: this.vm.plazaState.message,
                        retryAction: async () => {
                            await this.vm.loadPlazaFirstPage();
                            this.vm = this.vm;
                        },
                        showLoadMore: this.vm.canLoadMorePlaza(),
                        isLoadingMore: this.vm.isLoadingMorePlaza,
                        loadMoreAction: async () => {
                            await this.vm.loadMorePlaza();
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
                                                        }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/features/plaza/PlazaPage.ets", line: 97, col: 11 });
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
                                this.forEachUpdateFunction(elmtId, this.vm.plazaState.data || [], forEachItemGenFunction, (item: PlazaArticle) => item.id.toString(), false, false);
                            }, ForEach);
                            ForEach.pop();
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/features/plaza/PlazaPage.ets", line: 80, col: 5 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            status: this.vm.plazaState.status,
                            message: this.vm.plazaState.message,
                            retryAction: async () => {
                                await this.vm.loadPlazaFirstPage();
                                this.vm = this.vm;
                            },
                            showLoadMore: this.vm.canLoadMorePlaza(),
                            isLoadingMore: this.vm.isLoadingMorePlaza,
                            loadMoreAction: async () => {
                                await this.vm.loadMorePlaza();
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
                                                            }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/features/plaza/PlazaPage.ets", line: 97, col: 11 });
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
                                    this.forEachUpdateFunction(elmtId, this.vm.plazaState.data || [], forEachItemGenFunction, (item: PlazaArticle) => item.id.toString(), false, false);
                                }, ForEach);
                                ForEach.pop();
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        status: this.vm.plazaState.status,
                        message: this.vm.plazaState.message,
                        showLoadMore: this.vm.canLoadMorePlaza(),
                        isLoadingMore: this.vm.isLoadingMorePlaza
                    });
                }
            }, { name: "PagedListView" });
        }
    }
    private myShareArea(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (!SessionStore.shared().isLogin()) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.layoutWeight(1);
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('请先登录后使用分享能力');
                        Text.fontSize(14);
                        Text.fontColor('#666666');
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.layoutWeight(1);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 8 });
                        Column.padding(12);
                        Column.margin({ left: 12, right: 12, bottom: 8 });
                        Column.backgroundColor(Color.White);
                        Column.borderRadius(10);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TextInput.create({ placeholder: '分享标题', text: this.vm.shareTitleInput });
                        TextInput.onChange((value: string) => {
                            this.vm.shareTitleInput = value;
                            this.vm = this.vm;
                        });
                    }, TextInput);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TextInput.create({ placeholder: '分享链接', text: this.vm.shareLinkInput });
                        TextInput.onChange((value: string) => {
                            this.vm.shareLinkInput = value;
                            this.vm = this.vm;
                        });
                    }, TextInput);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('发布分享');
                        Button.width('100%');
                        Button.onClick(async () => {
                            await this.vm.submitShare();
                            this.vm = this.vm;
                        });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.vm.shareMessage.length > 0) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(this.vm.shareMessage);
                                    Text.fontSize(12);
                                    Text.fontColor('#666666');
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
                    Column.pop();
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new PagedListView(this, {
                                    status: this.vm.myShareState.status,
                                    message: this.vm.myShareState.message,
                                    retryAction: async () => {
                                        await this.vm.loadMyShareFirstPage();
                                        this.vm = this.vm;
                                    },
                                    showLoadMore: this.vm.canLoadMoreMyShare(),
                                    isLoadingMore: this.vm.isLoadingMoreMyShare,
                                    loadMoreAction: async () => {
                                        await this.vm.loadMoreMyShare();
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
                                                                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/features/plaza/PlazaPage.ets", line: 191, col: 17 });
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
                                                            Button.createWithLabel('删除');
                                                            Button.type(ButtonType.Capsule);
                                                            Button.margin({ top: 6 });
                                                            Button.onClick(async () => {
                                                                await this.vm.deleteMyShare(item.id);
                                                                this.vm = this.vm;
                                                            });
                                                        }, Button);
                                                        Button.pop();
                                                        Column.pop();
                                                        ListItem.pop();
                                                    };
                                                    this.observeComponentCreation2(itemCreation2, ListItem);
                                                    ListItem.pop();
                                                }
                                            };
                                            this.forEachUpdateFunction(elmtId, this.vm.myShareState.data || [], forEachItemGenFunction, (item: PlazaArticle) => item.id.toString(), false, false);
                                        }, ForEach);
                                        ForEach.pop();
                                    }
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/features/plaza/PlazaPage.ets", line: 174, col: 9 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        status: this.vm.myShareState.status,
                                        message: this.vm.myShareState.message,
                                        retryAction: async () => {
                                            await this.vm.loadMyShareFirstPage();
                                            this.vm = this.vm;
                                        },
                                        showLoadMore: this.vm.canLoadMoreMyShare(),
                                        isLoadingMore: this.vm.isLoadingMoreMyShare,
                                        loadMoreAction: async () => {
                                            await this.vm.loadMoreMyShare();
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
                                                                        }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/features/plaza/PlazaPage.ets", line: 191, col: 17 });
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
                                                                Button.createWithLabel('删除');
                                                                Button.type(ButtonType.Capsule);
                                                                Button.margin({ top: 6 });
                                                                Button.onClick(async () => {
                                                                    await this.vm.deleteMyShare(item.id);
                                                                    this.vm = this.vm;
                                                                });
                                                            }, Button);
                                                            Button.pop();
                                                            Column.pop();
                                                            ListItem.pop();
                                                        };
                                                        this.observeComponentCreation2(itemCreation2, ListItem);
                                                        ListItem.pop();
                                                    }
                                                };
                                                this.forEachUpdateFunction(elmtId, this.vm.myShareState.data || [], forEachItemGenFunction, (item: PlazaArticle) => item.id.toString(), false, false);
                                            }, ForEach);
                                            ForEach.pop();
                                        }
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    status: this.vm.myShareState.status,
                                    message: this.vm.myShareState.message,
                                    showLoadMore: this.vm.canLoadMoreMyShare(),
                                    isLoadingMore: this.vm.isLoadingMoreMyShare
                                });
                            }
                        }, { name: "PagedListView" });
                    }
                    Column.pop();
                });
            }
        }, If);
        If.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
