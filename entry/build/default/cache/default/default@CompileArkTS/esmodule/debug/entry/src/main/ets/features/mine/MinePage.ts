if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface MinePage_Params {
    onOpenLink?: (url: string) => void;
    authVm?: AuthViewModel;
    collectVm?: CollectViewModel;
    messageVm?: MessageViewModel;
    tab?: MineTab;
}
import { LoadStatus, UiState } from "@bundle:com.wanandroid.harmony/entry/ets/common/ui/LoadState";
import { ArticleCard } from "@bundle:com.wanandroid.harmony/entry/ets/common/ui/components/ArticleCard";
import { PagedListView } from "@bundle:com.wanandroid.harmony/entry/ets/common/ui/components/PagedListView";
import { PageHeader } from "@bundle:com.wanandroid.harmony/entry/ets/common/ui/components/PageHeader";
import { UiTheme } from "@bundle:com.wanandroid.harmony/entry/ets/common/ui/UiTheme";
import { AuthViewModel } from "@bundle:com.wanandroid.harmony/entry/ets/features/auth/AuthViewModel";
import { CollectViewModel } from "@bundle:com.wanandroid.harmony/entry/ets/features/collect/CollectViewModel";
import type { CollectItem } from '../collect/CollectRepository';
import { MessageViewModel } from "@bundle:com.wanandroid.harmony/entry/ets/features/message/MessageViewModel";
import type { MessageItem } from '../message/MessageRepository';
enum MineTab {
    COLLECT = 0,
    UNREAD_MSG = 1,
    READ_MSG = 2
}
export class MinePage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.onOpenLink = undefined;
        this.__authVm = new ObservedPropertyObjectPU(new AuthViewModel(), this, "authVm");
        this.__collectVm = new ObservedPropertyObjectPU(new CollectViewModel(), this, "collectVm");
        this.__messageVm = new ObservedPropertyObjectPU(new MessageViewModel(), this, "messageVm");
        this.__tab = new ObservedPropertySimplePU(MineTab.COLLECT, this, "tab");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: MinePage_Params) {
        if (params.onOpenLink !== undefined) {
            this.onOpenLink = params.onOpenLink;
        }
        if (params.authVm !== undefined) {
            this.authVm = params.authVm;
        }
        if (params.collectVm !== undefined) {
            this.collectVm = params.collectVm;
        }
        if (params.messageVm !== undefined) {
            this.messageVm = params.messageVm;
        }
        if (params.tab !== undefined) {
            this.tab = params.tab;
        }
    }
    updateStateVars(params: MinePage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__authVm.purgeDependencyOnElmtId(rmElmtId);
        this.__collectVm.purgeDependencyOnElmtId(rmElmtId);
        this.__messageVm.purgeDependencyOnElmtId(rmElmtId);
        this.__tab.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__authVm.aboutToBeDeleted();
        this.__collectVm.aboutToBeDeleted();
        this.__messageVm.aboutToBeDeleted();
        this.__tab.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private onOpenLink?: (url: string) => void;
    private __authVm: ObservedPropertyObjectPU<AuthViewModel>;
    get authVm() {
        return this.__authVm.get();
    }
    set authVm(newValue: AuthViewModel) {
        this.__authVm.set(newValue);
    }
    private __collectVm: ObservedPropertyObjectPU<CollectViewModel>;
    get collectVm() {
        return this.__collectVm.get();
    }
    set collectVm(newValue: CollectViewModel) {
        this.__collectVm.set(newValue);
    }
    private __messageVm: ObservedPropertyObjectPU<MessageViewModel>;
    get messageVm() {
        return this.__messageVm.get();
    }
    set messageVm(newValue: MessageViewModel) {
        this.__messageVm.set(newValue);
    }
    private __tab: ObservedPropertySimplePU<MineTab>;
    get tab() {
        return this.__tab.get();
    }
    set tab(newValue: MineTab) {
        this.__tab.set(newValue);
    }
    aboutToAppear(): void {
        this.initPage();
    }
    private async initPage(): Promise<void> {
        this.authVm.restoreSession();
        if (this.authVm.authState.status === LoadStatus.Success) {
            await Promise.all([
                this.authVm.loadUserInfo(),
                this.collectVm.loadFirstPage(),
                this.messageVm.init()
            ]);
        }
        this.authVm = this.authVm;
        this.collectVm = this.collectVm;
        this.messageVm = this.messageVm;
    }
    private async loginOrRegister(): Promise<void> {
        await this.authVm.loginOrRegister();
        if (this.authVm.authState.status === LoadStatus.Success) {
            await Promise.all([
                this.authVm.loadUserInfo(),
                this.collectVm.loadFirstPage(),
                this.messageVm.init()
            ]);
        }
        this.authVm = this.authVm;
        this.collectVm = this.collectVm;
        this.messageVm = this.messageVm;
    }
    private async logout(): Promise<void> {
        await this.authVm.logout();
        this.collectVm.state = UiState.empty('请先登录');
        this.messageVm.unreadCount = 0;
        this.messageVm.unreadState = UiState.empty('请先登录');
        this.messageVm.readState = UiState.empty('请先登录');
        this.authVm = this.authVm;
        this.collectVm = this.collectVm;
        this.messageVm = this.messageVm;
    }
    private async loadMoreCollect(): Promise<void> {
        await this.collectVm.loadMore();
        this.collectVm = this.collectVm;
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
                    let componentCall = new PageHeader(this, { title: '我的' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/features/mine/MinePage.ets", line: 77, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            title: '我的'
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        title: '我的'
                    });
                }
            }, { name: "PageHeader" });
        }
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.authVm.authState.status !== LoadStatus.Success || !this.authVm.authState.data) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.loginPanel.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.userPanel.bind(this)();
                    this.contentPanel.bind(this)();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    private loginPanel(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 10 });
            Column.padding(16);
            Column.margin({ left: 12, right: 12, top: 8 });
            Column.backgroundColor(UiTheme.BG_CARD);
            Column.borderRadius(10);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '账号', text: this.authVm.usernameInput });
            TextInput.onChange((value: string) => {
                this.authVm.usernameInput = value;
                this.authVm = this.authVm;
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '密码', text: this.authVm.passwordInput });
            TextInput.type(InputType.Password);
            TextInput.onChange((value: string) => {
                this.authVm.passwordInput = value;
                this.authVm = this.authVm;
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.authVm.registerMode ? '注册模式' : '登录模式');
            Text.fontSize(13);
            Text.fontColor(UiTheme.TEXT_SECONDARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('切换');
            Button.type(ButtonType.Capsule);
            Button.onClick(() => {
                this.authVm.registerMode = !this.authVm.registerMode;
                this.authVm = this.authVm;
            });
        }, Button);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.authVm.registerMode ? '注册并登录' : '登录');
            Button.width('100%');
            Button.onClick(() => this.loginOrRegister());
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.authVm.authState.status === LoadStatus.Error) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.authVm.authState.message);
                        Text.fontSize(12);
                        Text.fontColor(UiTheme.TEXT_DANGER);
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
    }
    private userPanel(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.authVm.authState.data) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 10 });
                        Column.width('100%');
                        Column.padding(12);
                        Column.margin({ left: 12, right: 12, top: 8, bottom: 8 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 6 });
                        Column.width('100%');
                        Column.padding(18);
                        Column.backgroundColor(UiTheme.BRAND_PRIMARY);
                        Column.borderRadius(UiTheme.RADIUS_MD);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.authVm.authState.data.nickname);
                        Text.fontSize(28);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor('#FFFFFF');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`Lv.${this.authVm.userInfoState.data ? this.authVm.userInfoState.data.coinInfo.level : 1} · 排名 #${this.authVm.userInfoState.data ? this.authVm.userInfoState.data.coinInfo.rank : '-'}`);
                        Text.fontSize(13);
                        Text.fontColor('#FFFFFFCC');
                    }, Text);
                    Text.pop();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.padding(12);
                        Row.backgroundColor(UiTheme.BG_CARD);
                        Row.borderRadius(UiTheme.RADIUS_MD);
                    }, Row);
                    this.statCell.bind(this)(this.authVm.userInfoState.data ? this.authVm.userInfoState.data.coinInfo.coinCount.toString() : '-', '积分');
                    this.statCell.bind(this)(this.authVm.userInfoState.data ? this.authVm.userInfoState.data.coinInfo.rank : '-', '排名');
                    this.statCell.bind(this)(this.messageVm.unreadCount.toString(), '消息');
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('退出登录');
                        Button.type(ButtonType.Capsule);
                        Button.backgroundColor('#FFFFFF');
                        Button.fontColor(UiTheme.TEXT_DANGER);
                        Button.onClick(() => this.logout());
                    }, Button);
                    Button.pop();
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
    private statCell(value: string | number, label: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 2 });
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${value}`);
            Text.fontSize(22);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(UiTheme.TEXT_PRIMARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(label);
            Text.fontSize(12);
            Text.fontColor(UiTheme.TEXT_SECONDARY);
        }, Text);
        Text.pop();
        Column.pop();
    }
    private contentPanel(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
            Row.width('100%');
            Row.padding({ left: 12, right: 12, top: 4, bottom: 8 });
        }, Row);
        this.tabButton.bind(this)('收藏', MineTab.COLLECT);
        this.tabButton.bind(this)('未读消息', MineTab.UNREAD_MSG);
        this.tabButton.bind(this)('已读消息', MineTab.READ_MSG);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.tab === MineTab.COLLECT) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.collectListPanel.bind(this)();
                });
            }
            else if (this.tab === MineTab.UNREAD_MSG) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.messageListPanel.bind(this)('未读消息', this.messageVm.unreadState, true);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.messageListPanel.bind(this)('已读消息', this.messageVm.readState, false);
                });
            }
        }, If);
        If.pop();
    }
    private collectListPanel(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('我的收藏');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.width('100%');
            Text.padding({ left: 16, right: 16, top: 2, bottom: 6 });
        }, Text);
        Text.pop();
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new PagedListView(this, {
                        status: this.collectVm.state.status,
                        message: this.collectVm.state.message,
                        retryAction: async () => {
                            await this.collectVm.loadFirstPage();
                            this.collectVm = this.collectVm;
                        },
                        showLoadMore: this.collectVm.canLoadMore(),
                        isLoadingMore: this.collectVm.isLoadingMore,
                        loadMoreAction: () => this.loadMoreCollect(),
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
                                                                niceDate: item.niceDate
                                                            },
                                                            clickAction: () => {
                                                                if (this.onOpenLink) {
                                                                    this.onOpenLink(item.link);
                                                                }
                                                            }
                                                        }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/features/mine/MinePage.ets", line: 231, col: 13 });
                                                        ViewPU.create(componentCall);
                                                        let paramsLambda = () => {
                                                            return {
                                                                article: {
                                                                    id: item.id,
                                                                    title: item.title,
                                                                    author: item.author,
                                                                    niceDate: item.niceDate
                                                                },
                                                                clickAction: () => {
                                                                    if (this.onOpenLink) {
                                                                        this.onOpenLink(item.link);
                                                                    }
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
                                                                niceDate: item.niceDate
                                                            }
                                                        });
                                                    }
                                                }, { name: "ArticleCard" });
                                            }
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Button.createWithLabel('取消收藏');
                                                Button.type(ButtonType.Capsule);
                                                Button.margin({ top: 6 });
                                                Button.onClick(async () => {
                                                    await this.collectVm.uncollect(item.id);
                                                    this.collectVm = this.collectVm;
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
                                this.forEachUpdateFunction(elmtId, this.collectVm.state.data || [], forEachItemGenFunction, (item: CollectItem) => item.id.toString(), false, false);
                            }, ForEach);
                            ForEach.pop();
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/features/mine/MinePage.ets", line: 217, col: 5 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            status: this.collectVm.state.status,
                            message: this.collectVm.state.message,
                            retryAction: async () => {
                                await this.collectVm.loadFirstPage();
                                this.collectVm = this.collectVm;
                            },
                            showLoadMore: this.collectVm.canLoadMore(),
                            isLoadingMore: this.collectVm.isLoadingMore,
                            loadMoreAction: () => this.loadMoreCollect(),
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
                                                                    niceDate: item.niceDate
                                                                },
                                                                clickAction: () => {
                                                                    if (this.onOpenLink) {
                                                                        this.onOpenLink(item.link);
                                                                    }
                                                                }
                                                            }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/features/mine/MinePage.ets", line: 231, col: 13 });
                                                            ViewPU.create(componentCall);
                                                            let paramsLambda = () => {
                                                                return {
                                                                    article: {
                                                                        id: item.id,
                                                                        title: item.title,
                                                                        author: item.author,
                                                                        niceDate: item.niceDate
                                                                    },
                                                                    clickAction: () => {
                                                                        if (this.onOpenLink) {
                                                                            this.onOpenLink(item.link);
                                                                        }
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
                                                                    niceDate: item.niceDate
                                                                }
                                                            });
                                                        }
                                                    }, { name: "ArticleCard" });
                                                }
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Button.createWithLabel('取消收藏');
                                                    Button.type(ButtonType.Capsule);
                                                    Button.margin({ top: 6 });
                                                    Button.onClick(async () => {
                                                        await this.collectVm.uncollect(item.id);
                                                        this.collectVm = this.collectVm;
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
                                    this.forEachUpdateFunction(elmtId, this.collectVm.state.data || [], forEachItemGenFunction, (item: CollectItem) => item.id.toString(), false, false);
                                }, ForEach);
                                ForEach.pop();
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        status: this.collectVm.state.status,
                        message: this.collectVm.state.message,
                        showLoadMore: this.collectVm.canLoadMore(),
                        isLoadingMore: this.collectVm.isLoadingMore
                    });
                }
            }, { name: "PagedListView" });
        }
    }
    private messageListPanel(title: string, state: UiState<MessageItem[]>, unread: boolean, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(title);
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.width('100%');
            Text.padding({ left: 16, right: 16, top: 2, bottom: 6 });
        }, Text);
        Text.pop();
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new PagedListView(this, {
                        status: state.status,
                        message: state.message,
                        retryAction: async () => {
                            await this.messageVm.init();
                            this.messageVm = this.messageVm;
                        },
                        showLoadMore: unread ? this.messageVm.canLoadMoreUnread() : this.messageVm.canLoadMoreRead(),
                        isLoadingMore: unread ? this.messageVm.isLoadingMoreUnread : this.messageVm.isLoadingMoreRead,
                        loadMoreAction: async () => {
                            if (unread) {
                                await this.messageVm.loadMoreUnread();
                            }
                            else {
                                await this.messageVm.loadMoreRead();
                            }
                            this.messageVm = this.messageVm;
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
                                                Column.width('100%');
                                                Column.padding(12);
                                                Column.backgroundColor(UiTheme.BG_CARD);
                                                Column.borderRadius(8);
                                            }, Column);
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Text.create(item.title);
                                                Text.fontSize(14);
                                                Text.fontWeight(FontWeight.Medium);
                                            }, Text);
                                            Text.pop();
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Text.create(item.message);
                                                Text.fontSize(13);
                                                Text.fontColor(UiTheme.TEXT_SECONDARY);
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
                                                If.create();
                                                if (item.fullLink && this.onOpenLink) {
                                                    this.ifElseBranchUpdateFunction(0, () => {
                                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                            Button.createWithLabel('查看链接');
                                                            Button.type(ButtonType.Capsule);
                                                            Button.margin({ top: 6 });
                                                            Button.onClick(() => {
                                                                if (this.onOpenLink) {
                                                                    this.onOpenLink(item.fullLink || '');
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
                                this.forEachUpdateFunction(elmtId, state.data || [], forEachItemGenFunction, (item: MessageItem) => item.id.toString(), false, false);
                            }, ForEach);
                            ForEach.pop();
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/features/mine/MinePage.ets", line: 265, col: 5 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            status: state.status,
                            message: state.message,
                            retryAction: async () => {
                                await this.messageVm.init();
                                this.messageVm = this.messageVm;
                            },
                            showLoadMore: unread ? this.messageVm.canLoadMoreUnread() : this.messageVm.canLoadMoreRead(),
                            isLoadingMore: unread ? this.messageVm.isLoadingMoreUnread : this.messageVm.isLoadingMoreRead,
                            loadMoreAction: async () => {
                                if (unread) {
                                    await this.messageVm.loadMoreUnread();
                                }
                                else {
                                    await this.messageVm.loadMoreRead();
                                }
                                this.messageVm = this.messageVm;
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
                                                    Column.width('100%');
                                                    Column.padding(12);
                                                    Column.backgroundColor(UiTheme.BG_CARD);
                                                    Column.borderRadius(8);
                                                }, Column);
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create(item.title);
                                                    Text.fontSize(14);
                                                    Text.fontWeight(FontWeight.Medium);
                                                }, Text);
                                                Text.pop();
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create(item.message);
                                                    Text.fontSize(13);
                                                    Text.fontColor(UiTheme.TEXT_SECONDARY);
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
                                                    If.create();
                                                    if (item.fullLink && this.onOpenLink) {
                                                        this.ifElseBranchUpdateFunction(0, () => {
                                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                                Button.createWithLabel('查看链接');
                                                                Button.type(ButtonType.Capsule);
                                                                Button.margin({ top: 6 });
                                                                Button.onClick(() => {
                                                                    if (this.onOpenLink) {
                                                                        this.onOpenLink(item.fullLink || '');
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
                                    this.forEachUpdateFunction(elmtId, state.data || [], forEachItemGenFunction, (item: MessageItem) => item.id.toString(), false, false);
                                }, ForEach);
                                ForEach.pop();
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        status: state.status,
                        message: state.message,
                        showLoadMore: unread ? this.messageVm.canLoadMoreUnread() : this.messageVm.canLoadMoreRead(),
                        isLoadingMore: unread ? this.messageVm.isLoadingMoreUnread : this.messageVm.isLoadingMoreRead
                    });
                }
            }, { name: "PagedListView" });
        }
    }
    private tabButton(label: string, tab: MineTab, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(label);
            Button.type(this.tab === tab ? ButtonType.Capsule : ButtonType.Normal);
            Button.backgroundColor(this.tab === tab ? UiTheme.BRAND_PRIMARY : UiTheme.BG_CARD);
            Button.fontColor(this.tab === tab ? '#FFFFFF' : UiTheme.TEXT_SECONDARY);
            Button.onClick(() => {
                this.tab = tab;
            });
        }, Button);
        Button.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
