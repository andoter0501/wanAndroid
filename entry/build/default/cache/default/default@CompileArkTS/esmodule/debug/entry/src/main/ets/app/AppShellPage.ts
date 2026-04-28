if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface AppShellPage_Params {
    currentTab?: MainTab;
    showSearch?: boolean;
    showWeb?: boolean;
    showUserShare?: boolean;
    currentUrl?: string;
    currentUserId?: number;
    currentUsername?: string;
    warning?: string;
    sessionListener?;
}
import { DiscoverPage } from "@bundle:com.wanandroid.harmony/entry/ets/features/discover/DiscoverPage";
import { HomePage } from "@bundle:com.wanandroid.harmony/entry/ets/features/home/HomePage";
import { MinePage } from "@bundle:com.wanandroid.harmony/entry/ets/features/mine/MinePage";
import { PlazaPage } from "@bundle:com.wanandroid.harmony/entry/ets/features/plaza/PlazaPage";
import { SearchPage } from "@bundle:com.wanandroid.harmony/entry/ets/features/search/SearchPage";
import { UserSharePage } from "@bundle:com.wanandroid.harmony/entry/ets/features/user/UserSharePage";
import { WendaPage } from "@bundle:com.wanandroid.harmony/entry/ets/features/wenda/WendaPage";
import { WebDetailPage } from "@bundle:com.wanandroid.harmony/entry/ets/features/web/WebDetailPage";
import { UrlSecurityGuard } from "@bundle:com.wanandroid.harmony/entry/ets/common/web/UrlSecurityGuard";
import { SessionEventBus, SessionEventType } from "@bundle:com.wanandroid.harmony/entry/ets/common/session/SessionEventBus";
enum MainTab {
    HOME = 0,
    DISCOVER = 1,
    PLAZA = 2,
    WENDA = 3,
    MINE = 4
}
export class AppShellPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentTab = new ObservedPropertySimplePU(MainTab.HOME, this, "currentTab");
        this.__showSearch = new ObservedPropertySimplePU(false, this, "showSearch");
        this.__showWeb = new ObservedPropertySimplePU(false, this, "showWeb");
        this.__showUserShare = new ObservedPropertySimplePU(false, this, "showUserShare");
        this.__currentUrl = new ObservedPropertySimplePU('', this, "currentUrl");
        this.__currentUserId = new ObservedPropertySimplePU(0, this, "currentUserId");
        this.__currentUsername = new ObservedPropertySimplePU('', this, "currentUsername");
        this.__warning = new ObservedPropertySimplePU('', this, "warning");
        this.sessionListener = (event: SessionEventType, message: string): void => {
            if (event === SessionEventType.EXPIRED) {
                this.showSearch = false;
                this.showWeb = false;
                this.showUserShare = false;
                this.currentTab = MainTab.MINE;
                this.warning = message || '登录已失效，请重新登录';
            }
        };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: AppShellPage_Params) {
        if (params.currentTab !== undefined) {
            this.currentTab = params.currentTab;
        }
        if (params.showSearch !== undefined) {
            this.showSearch = params.showSearch;
        }
        if (params.showWeb !== undefined) {
            this.showWeb = params.showWeb;
        }
        if (params.showUserShare !== undefined) {
            this.showUserShare = params.showUserShare;
        }
        if (params.currentUrl !== undefined) {
            this.currentUrl = params.currentUrl;
        }
        if (params.currentUserId !== undefined) {
            this.currentUserId = params.currentUserId;
        }
        if (params.currentUsername !== undefined) {
            this.currentUsername = params.currentUsername;
        }
        if (params.warning !== undefined) {
            this.warning = params.warning;
        }
        if (params.sessionListener !== undefined) {
            this.sessionListener = params.sessionListener;
        }
    }
    updateStateVars(params: AppShellPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentTab.purgeDependencyOnElmtId(rmElmtId);
        this.__showSearch.purgeDependencyOnElmtId(rmElmtId);
        this.__showWeb.purgeDependencyOnElmtId(rmElmtId);
        this.__showUserShare.purgeDependencyOnElmtId(rmElmtId);
        this.__currentUrl.purgeDependencyOnElmtId(rmElmtId);
        this.__currentUserId.purgeDependencyOnElmtId(rmElmtId);
        this.__currentUsername.purgeDependencyOnElmtId(rmElmtId);
        this.__warning.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentTab.aboutToBeDeleted();
        this.__showSearch.aboutToBeDeleted();
        this.__showWeb.aboutToBeDeleted();
        this.__showUserShare.aboutToBeDeleted();
        this.__currentUrl.aboutToBeDeleted();
        this.__currentUserId.aboutToBeDeleted();
        this.__currentUsername.aboutToBeDeleted();
        this.__warning.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __currentTab: ObservedPropertySimplePU<MainTab>;
    get currentTab() {
        return this.__currentTab.get();
    }
    set currentTab(newValue: MainTab) {
        this.__currentTab.set(newValue);
    }
    private __showSearch: ObservedPropertySimplePU<boolean>;
    get showSearch() {
        return this.__showSearch.get();
    }
    set showSearch(newValue: boolean) {
        this.__showSearch.set(newValue);
    }
    private __showWeb: ObservedPropertySimplePU<boolean>;
    get showWeb() {
        return this.__showWeb.get();
    }
    set showWeb(newValue: boolean) {
        this.__showWeb.set(newValue);
    }
    private __showUserShare: ObservedPropertySimplePU<boolean>;
    get showUserShare() {
        return this.__showUserShare.get();
    }
    set showUserShare(newValue: boolean) {
        this.__showUserShare.set(newValue);
    }
    private __currentUrl: ObservedPropertySimplePU<string>;
    get currentUrl() {
        return this.__currentUrl.get();
    }
    set currentUrl(newValue: string) {
        this.__currentUrl.set(newValue);
    }
    private __currentUserId: ObservedPropertySimplePU<number>;
    get currentUserId() {
        return this.__currentUserId.get();
    }
    set currentUserId(newValue: number) {
        this.__currentUserId.set(newValue);
    }
    private __currentUsername: ObservedPropertySimplePU<string>;
    get currentUsername() {
        return this.__currentUsername.get();
    }
    set currentUsername(newValue: string) {
        this.__currentUsername.set(newValue);
    }
    private __warning: ObservedPropertySimplePU<string>;
    get warning() {
        return this.__warning.get();
    }
    set warning(newValue: string) {
        this.__warning.set(newValue);
    }
    private readonly sessionListener;
    aboutToAppear(): void {
        SessionEventBus.subscribe(this.sessionListener);
    }
    aboutToDisappear(): void {
        SessionEventBus.unsubscribe(this.sessionListener);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.showSearch) {
                this.ifElseBranchUpdateFunction(0, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new SearchPage(this, {
                                    onBack: () => {
                                        Context.animateTo({ duration: 160, curve: Curve.EaseInOut }, () => {
                                            this.showSearch = false;
                                        });
                                    },
                                    onOpenLink: (url: string) => {
                                        this.openLink(url);
                                    }
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/app/AppShellPage.ets", line: 51, col: 9 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        onBack: () => {
                                            Context.animateTo({ duration: 160, curve: Curve.EaseInOut }, () => {
                                                this.showSearch = false;
                                            });
                                        },
                                        onOpenLink: (url: string) => {
                                            this.openLink(url);
                                        }
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "SearchPage" });
                    }
                });
            }
            else if (this.showUserShare) {
                this.ifElseBranchUpdateFunction(1, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new UserSharePage(this, {
                                    userId: this.currentUserId,
                                    username: this.currentUsername,
                                    onBack: () => {
                                        Context.animateTo({ duration: 160, curve: Curve.EaseInOut }, () => {
                                            this.showUserShare = false;
                                        });
                                    },
                                    onOpenLink: (url: string) => {
                                        this.openLink(url);
                                    }
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/app/AppShellPage.ets", line: 62, col: 9 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        userId: this.currentUserId,
                                        username: this.currentUsername,
                                        onBack: () => {
                                            Context.animateTo({ duration: 160, curve: Curve.EaseInOut }, () => {
                                                this.showUserShare = false;
                                            });
                                        },
                                        onOpenLink: (url: string) => {
                                            this.openLink(url);
                                        }
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    userId: this.currentUserId,
                                    username: this.currentUsername
                                });
                            }
                        }, { name: "UserSharePage" });
                    }
                });
            }
            else if (this.showWeb) {
                this.ifElseBranchUpdateFunction(2, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new WebDetailPage(this, {
                                    url: this.currentUrl,
                                    onBack: () => {
                                        Context.animateTo({ duration: 160, curve: Curve.EaseInOut }, () => {
                                            this.showWeb = false;
                                        });
                                    }
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/app/AppShellPage.ets", line: 75, col: 9 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        url: this.currentUrl,
                                        onBack: () => {
                                            Context.animateTo({ duration: 160, curve: Curve.EaseInOut }, () => {
                                                this.showWeb = false;
                                            });
                                        }
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    url: this.currentUrl
                                });
                            }
                        }, { name: "WebDetailPage" });
                    }
                });
            }
            else {
                this.ifElseBranchUpdateFunction(3, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.currentTab === MainTab.HOME) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new HomePage(this, {
                                                onOpenSearch: () => {
                                                    Context.animateTo({ duration: 160, curve: Curve.EaseInOut }, () => {
                                                        this.showSearch = true;
                                                    });
                                                },
                                                onOpenLink: (url: string) => {
                                                    this.openLink(url);
                                                }
                                            }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/app/AppShellPage.ets", line: 85, col: 11 });
                                            ViewPU.create(componentCall);
                                            let paramsLambda = () => {
                                                return {
                                                    onOpenSearch: () => {
                                                        Context.animateTo({ duration: 160, curve: Curve.EaseInOut }, () => {
                                                            this.showSearch = true;
                                                        });
                                                    },
                                                    onOpenLink: (url: string) => {
                                                        this.openLink(url);
                                                    }
                                                };
                                            };
                                            componentCall.paramsGenerator_ = paramsLambda;
                                        }
                                        else {
                                            this.updateStateVarsOfChildByElmtId(elmtId, {});
                                        }
                                    }, { name: "HomePage" });
                                }
                            });
                        }
                        else if (this.currentTab === MainTab.DISCOVER) {
                            this.ifElseBranchUpdateFunction(1, () => {
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new DiscoverPage(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/app/AppShellPage.ets", line: 96, col: 11 });
                                            ViewPU.create(componentCall);
                                            let paramsLambda = () => {
                                                return {};
                                            };
                                            componentCall.paramsGenerator_ = paramsLambda;
                                        }
                                        else {
                                            this.updateStateVarsOfChildByElmtId(elmtId, {});
                                        }
                                    }, { name: "DiscoverPage" });
                                }
                            });
                        }
                        else if (this.currentTab === MainTab.PLAZA) {
                            this.ifElseBranchUpdateFunction(2, () => {
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new PlazaPage(this, {
                                                onOpenLink: (url: string) => {
                                                    this.openLink(url);
                                                },
                                                onOpenUserShare: (userId: number, username: string) => {
                                                    this.openUserShare(userId, username);
                                                }
                                            }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/app/AppShellPage.ets", line: 98, col: 11 });
                                            ViewPU.create(componentCall);
                                            let paramsLambda = () => {
                                                return {
                                                    onOpenLink: (url: string) => {
                                                        this.openLink(url);
                                                    },
                                                    onOpenUserShare: (userId: number, username: string) => {
                                                        this.openUserShare(userId, username);
                                                    }
                                                };
                                            };
                                            componentCall.paramsGenerator_ = paramsLambda;
                                        }
                                        else {
                                            this.updateStateVarsOfChildByElmtId(elmtId, {});
                                        }
                                    }, { name: "PlazaPage" });
                                }
                            });
                        }
                        else if (this.currentTab === MainTab.WENDA) {
                            this.ifElseBranchUpdateFunction(3, () => {
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new WendaPage(this, {
                                                onOpenLink: (url: string) => {
                                                    this.openLink(url);
                                                },
                                                onOpenUserShare: (userId: number, username: string) => {
                                                    this.openUserShare(userId, username);
                                                }
                                            }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/app/AppShellPage.ets", line: 107, col: 11 });
                                            ViewPU.create(componentCall);
                                            let paramsLambda = () => {
                                                return {
                                                    onOpenLink: (url: string) => {
                                                        this.openLink(url);
                                                    },
                                                    onOpenUserShare: (userId: number, username: string) => {
                                                        this.openUserShare(userId, username);
                                                    }
                                                };
                                            };
                                            componentCall.paramsGenerator_ = paramsLambda;
                                        }
                                        else {
                                            this.updateStateVarsOfChildByElmtId(elmtId, {});
                                        }
                                    }, { name: "WendaPage" });
                                }
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(4, () => {
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new MinePage(this, {
                                                onOpenLink: (url: string) => {
                                                    this.openLink(url);
                                                }
                                            }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/app/AppShellPage.ets", line: 116, col: 11 });
                                            ViewPU.create(componentCall);
                                            let paramsLambda = () => {
                                                return {
                                                    onOpenLink: (url: string) => {
                                                        this.openLink(url);
                                                    }
                                                };
                                            };
                                            componentCall.paramsGenerator_ = paramsLambda;
                                        }
                                        else {
                                            this.updateStateVarsOfChildByElmtId(elmtId, {});
                                        }
                                    }, { name: "MinePage" });
                                }
                            });
                        }
                    }, If);
                    If.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.warning.length > 0 && !this.showSearch && !this.showWeb && !this.showUserShare) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.warning);
                        Text.width('100%');
                        Text.fontSize(12);
                        Text.fontColor('#C97A00');
                        Text.padding({ left: 12, right: 12, top: 6, bottom: 6 });
                        Text.backgroundColor('#FFF6E5');
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
            If.create();
            if (!this.showSearch && !this.showWeb && !this.showUserShare) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.height(56);
                        Row.justifyContent(FlexAlign.SpaceAround);
                        Row.backgroundColor(Color.White);
                    }, Row);
                    this.tabItem.bind(this)('首页', MainTab.HOME);
                    this.tabItem.bind(this)('发现', MainTab.DISCOVER);
                    this.tabItem.bind(this)('广场', MainTab.PLAZA);
                    this.tabItem.bind(this)('问答', MainTab.WENDA);
                    this.tabItem.bind(this)('我的', MainTab.MINE);
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    private openLink(url: string): void {
        const result = UrlSecurityGuard.check(url);
        if (!result.allow) {
            this.warning = result.reason;
            return;
        }
        this.warning = result.reason;
        this.currentUrl = url;
        Context.animateTo({ duration: 180, curve: Curve.EaseInOut }, () => {
            this.showWeb = true;
        });
    }
    private openUserShare(userId: number, username: string): void {
        if (userId <= 0) {
            this.warning = '该分享人信息无效';
            return;
        }
        this.currentUserId = userId;
        this.currentUsername = username || '分享人';
        Context.animateTo({ duration: 180, curve: Curve.EaseInOut }, () => {
            this.showUserShare = true;
        });
    }
    private switchTab(tab: MainTab): void {
        Context.animateTo({ duration: 160, curve: Curve.EaseInOut }, () => {
            this.currentTab = tab;
        });
    }
    private tabItem(label: string, tab: MainTab, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(label);
            Text.fontSize(13);
            Text.fontColor(this.currentTab === tab ? '#0A59F7' : '#666666');
            Text.onClick(() => {
                this.switchTab(tab);
            });
        }, Text);
        Text.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
