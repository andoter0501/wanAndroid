if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface DiscoverPage_Params {
    vm?: DiscoverViewModel;
    currentTab?: DiscoverTab;
}
import { PagedListView } from "@bundle:com.wanandroid.harmony/entry/ets/common/ui/components/PagedListView";
import { PageHeader } from "@bundle:com.wanandroid.harmony/entry/ets/common/ui/components/PageHeader";
import { UiTheme } from "@bundle:com.wanandroid.harmony/entry/ets/common/ui/UiTheme";
import { StateView } from "@bundle:com.wanandroid.harmony/entry/ets/common/ui/components/StateView";
import { DiscoverViewModel } from "@bundle:com.wanandroid.harmony/entry/ets/features/discover/DiscoverViewModel";
import type { NaviGroup, ProjectCategory, ProjectItem, TreeNode } from './DiscoverRepository';
enum DiscoverTab {
    TREE = 0,
    NAVI = 1,
    PROJECT = 2
}
export class DiscoverPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__vm = new ObservedPropertyObjectPU(new DiscoverViewModel(), this, "vm");
        this.__currentTab = new ObservedPropertySimplePU(DiscoverTab.TREE, this, "currentTab");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: DiscoverPage_Params) {
        if (params.vm !== undefined) {
            this.vm = params.vm;
        }
        if (params.currentTab !== undefined) {
            this.currentTab = params.currentTab;
        }
    }
    updateStateVars(params: DiscoverPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__vm.purgeDependencyOnElmtId(rmElmtId);
        this.__currentTab.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__vm.aboutToBeDeleted();
        this.__currentTab.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __vm: ObservedPropertyObjectPU<DiscoverViewModel>;
    get vm() {
        return this.__vm.get();
    }
    set vm(newValue: DiscoverViewModel) {
        this.__vm.set(newValue);
    }
    private __currentTab: ObservedPropertySimplePU<DiscoverTab>;
    get currentTab() {
        return this.__currentTab.get();
    }
    set currentTab(newValue: DiscoverTab) {
        this.__currentTab.set(newValue);
    }
    aboutToAppear(): void {
        this.initPage();
    }
    private async initPage(): Promise<void> {
        await this.vm.init();
        this.vm = this.vm;
    }
    private async loadMoreProject(): Promise<void> {
        await this.vm.loadMoreProjects();
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
                    let componentCall = new PageHeader(this, { title: '发现' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/features/discover/DiscoverPage.ets", line: 35, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            title: '发现'
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        title: '发现'
                    });
                }
            }, { name: "PageHeader" });
        }
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
            Row.width('100%');
            Row.padding({ left: 12, right: 12, bottom: 10 });
        }, Row);
        this.tabButton.bind(this)('体系', DiscoverTab.TREE);
        this.tabButton.bind(this)('导航', DiscoverTab.NAVI);
        this.tabButton.bind(this)('项目', DiscoverTab.PROJECT);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.currentTab === DiscoverTab.TREE) {
                this.ifElseBranchUpdateFunction(0, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new StateView(this, {
                                    status: this.vm.treeState.status,
                                    message: this.vm.treeState.message,
                                    retryAction: () => this.vm.loadTree(),
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
                                                            Text.create(item.name);
                                                            Text.fontSize(15);
                                                            Text.fontWeight(FontWeight.Medium);
                                                        }, Text);
                                                        Text.pop();
                                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                            Text.create(`子分类: ${(item.children || []).length}`);
                                                            Text.fontSize(12);
                                                            Text.margin({ top: 4 });
                                                            Text.fontColor(UiTheme.TEXT_SECONDARY);
                                                        }, Text);
                                                        Text.pop();
                                                        Column.pop();
                                                        ListItem.pop();
                                                    };
                                                    this.observeComponentCreation2(itemCreation2, ListItem);
                                                    ListItem.pop();
                                                }
                                            };
                                            this.forEachUpdateFunction(elmtId, this.vm.treeState.data || [], forEachItemGenFunction, (item: TreeNode) => item.id.toString(), false, false);
                                        }, ForEach);
                                        ForEach.pop();
                                        List.pop();
                                    }
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/features/discover/DiscoverPage.ets", line: 46, col: 9 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        status: this.vm.treeState.status,
                                        message: this.vm.treeState.message,
                                        retryAction: () => this.vm.loadTree(),
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
                                                                Text.create(item.name);
                                                                Text.fontSize(15);
                                                                Text.fontWeight(FontWeight.Medium);
                                                            }, Text);
                                                            Text.pop();
                                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                                Text.create(`子分类: ${(item.children || []).length}`);
                                                                Text.fontSize(12);
                                                                Text.margin({ top: 4 });
                                                                Text.fontColor(UiTheme.TEXT_SECONDARY);
                                                            }, Text);
                                                            Text.pop();
                                                            Column.pop();
                                                            ListItem.pop();
                                                        };
                                                        this.observeComponentCreation2(itemCreation2, ListItem);
                                                        ListItem.pop();
                                                    }
                                                };
                                                this.forEachUpdateFunction(elmtId, this.vm.treeState.data || [], forEachItemGenFunction, (item: TreeNode) => item.id.toString(), false, false);
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
                                    status: this.vm.treeState.status,
                                    message: this.vm.treeState.message
                                });
                            }
                        }, { name: "StateView" });
                    }
                });
            }
            else if (this.currentTab === DiscoverTab.NAVI) {
                this.ifElseBranchUpdateFunction(1, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new StateView(this, {
                                    status: this.vm.naviState.status,
                                    message: this.vm.naviState.message,
                                    retryAction: () => this.vm.loadNavi(),
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
                                                            Text.create(item.name);
                                                            Text.fontSize(15);
                                                            Text.fontWeight(FontWeight.Medium);
                                                        }, Text);
                                                        Text.pop();
                                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                            Text.create(`链接: ${item.articles.length}`);
                                                            Text.fontSize(12);
                                                            Text.margin({ top: 4 });
                                                            Text.fontColor(UiTheme.TEXT_SECONDARY);
                                                        }, Text);
                                                        Text.pop();
                                                        Column.pop();
                                                        ListItem.pop();
                                                    };
                                                    this.observeComponentCreation2(itemCreation2, ListItem);
                                                    ListItem.pop();
                                                }
                                            };
                                            this.forEachUpdateFunction(elmtId, this.vm.naviState.data || [], forEachItemGenFunction, (item: NaviGroup) => item.cid.toString(), false, false);
                                        }, ForEach);
                                        ForEach.pop();
                                        List.pop();
                                    }
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/features/discover/DiscoverPage.ets", line: 73, col: 9 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        status: this.vm.naviState.status,
                                        message: this.vm.naviState.message,
                                        retryAction: () => this.vm.loadNavi(),
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
                                                                Text.create(item.name);
                                                                Text.fontSize(15);
                                                                Text.fontWeight(FontWeight.Medium);
                                                            }, Text);
                                                            Text.pop();
                                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                                Text.create(`链接: ${item.articles.length}`);
                                                                Text.fontSize(12);
                                                                Text.margin({ top: 4 });
                                                                Text.fontColor(UiTheme.TEXT_SECONDARY);
                                                            }, Text);
                                                            Text.pop();
                                                            Column.pop();
                                                            ListItem.pop();
                                                        };
                                                        this.observeComponentCreation2(itemCreation2, ListItem);
                                                        ListItem.pop();
                                                    }
                                                };
                                                this.forEachUpdateFunction(elmtId, this.vm.naviState.data || [], forEachItemGenFunction, (item: NaviGroup) => item.cid.toString(), false, false);
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
                                    status: this.vm.naviState.status,
                                    message: this.vm.naviState.message
                                });
                            }
                        }, { name: "StateView" });
                    }
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Scroll.create();
                        Scroll.scrollable(ScrollDirection.Horizontal);
                        Scroll.width('100%');
                        Scroll.padding({ left: 12, right: 12, bottom: 10 });
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 8 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const item = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Button.createWithLabel(item.name);
                                Button.type(item.id === this.vm.selectedProjectCid ? ButtonType.Capsule : ButtonType.Normal);
                                Button.fontSize(13);
                                Button.backgroundColor(item.id === this.vm.selectedProjectCid ? UiTheme.BRAND_PRIMARY : UiTheme.BG_CARD);
                                Button.fontColor(item.id === this.vm.selectedProjectCid ? '#FFFFFF' : UiTheme.TEXT_SECONDARY);
                                Button.onClick(async () => {
                                    await this.vm.switchProjectCategory(item.id);
                                    this.vm = this.vm;
                                });
                            }, Button);
                            Button.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.vm.projectCategories, forEachItemGenFunction, (item: ProjectCategory) => item.id.toString(), false, false);
                    }, ForEach);
                    ForEach.pop();
                    Row.pop();
                    Scroll.pop();
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new PagedListView(this, {
                                    status: this.vm.projectState.status,
                                    message: this.vm.projectState.message,
                                    retryAction: () => this.vm.switchProjectCategory(this.vm.selectedProjectCid),
                                    showLoadMore: this.vm.canLoadMoreProject(),
                                    isLoadingMore: this.vm.isLoadingMoreProject,
                                    loadMoreText: '加载更多项目',
                                    loadMoreAction: () => this.loadMoreProject(),
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
                                                            Text.fontSize(15);
                                                            Text.fontWeight(FontWeight.Medium);
                                                            Text.maxLines(2);
                                                            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                                                        }, Text);
                                                        Text.pop();
                                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                            Text.create(item.desc || '');
                                                            Text.fontSize(12);
                                                            Text.margin({ top: 5 });
                                                            Text.fontColor(UiTheme.TEXT_SECONDARY);
                                                            Text.maxLines(2);
                                                            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                                                        }, Text);
                                                        Text.pop();
                                                        Column.pop();
                                                        ListItem.pop();
                                                    };
                                                    this.observeComponentCreation2(itemCreation2, ListItem);
                                                    ListItem.pop();
                                                }
                                            };
                                            this.forEachUpdateFunction(elmtId, this.vm.projectState.data || [], forEachItemGenFunction, (item: ProjectItem) => item.id.toString(), false, false);
                                        }, ForEach);
                                        ForEach.pop();
                                    }
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/features/discover/DiscoverPage.ets", line: 120, col: 11 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        status: this.vm.projectState.status,
                                        message: this.vm.projectState.message,
                                        retryAction: () => this.vm.switchProjectCategory(this.vm.selectedProjectCid),
                                        showLoadMore: this.vm.canLoadMoreProject(),
                                        isLoadingMore: this.vm.isLoadingMoreProject,
                                        loadMoreText: '加载更多项目',
                                        loadMoreAction: () => this.loadMoreProject(),
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
                                                                Text.fontSize(15);
                                                                Text.fontWeight(FontWeight.Medium);
                                                                Text.maxLines(2);
                                                                Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                                                            }, Text);
                                                            Text.pop();
                                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                                Text.create(item.desc || '');
                                                                Text.fontSize(12);
                                                                Text.margin({ top: 5 });
                                                                Text.fontColor(UiTheme.TEXT_SECONDARY);
                                                                Text.maxLines(2);
                                                                Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                                                            }, Text);
                                                            Text.pop();
                                                            Column.pop();
                                                            ListItem.pop();
                                                        };
                                                        this.observeComponentCreation2(itemCreation2, ListItem);
                                                        ListItem.pop();
                                                    }
                                                };
                                                this.forEachUpdateFunction(elmtId, this.vm.projectState.data || [], forEachItemGenFunction, (item: ProjectItem) => item.id.toString(), false, false);
                                            }, ForEach);
                                            ForEach.pop();
                                        }
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    status: this.vm.projectState.status,
                                    message: this.vm.projectState.message,
                                    showLoadMore: this.vm.canLoadMoreProject(),
                                    isLoadingMore: this.vm.isLoadingMoreProject,
                                    loadMoreText: '加载更多项目'
                                });
                            }
                        }, { name: "PagedListView" });
                    }
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    private tabButton(label: string, tab: DiscoverTab, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(label);
            Button.type(this.currentTab === tab ? ButtonType.Capsule : ButtonType.Normal);
            Button.backgroundColor(this.currentTab === tab ? UiTheme.BRAND_PRIMARY : UiTheme.BG_CARD);
            Button.fontColor(this.currentTab === tab ? '#FFFFFF' : UiTheme.TEXT_SECONDARY);
            Button.onClick(() => {
                this.currentTab = tab;
            });
        }, Button);
        Button.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
