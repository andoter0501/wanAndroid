if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface PagedListView_Params {
    status?: LoadStatus;
    message?: string;
    isLoadingMore?: boolean;
    showLoadMore?: boolean;
    loadMoreText?: string;
    retryAction?: () => void;
    loadMoreAction?: () => void;
    content?: () => void;
}
import { LoadStatus } from "@bundle:com.wanandroid.harmony/entry/ets/common/ui/LoadState";
import { AppText } from "@bundle:com.wanandroid.harmony/entry/ets/common/ui/AppText";
import { StateView } from "@bundle:com.wanandroid.harmony/entry/ets/common/ui/components/StateView";
import { UiTheme } from "@bundle:com.wanandroid.harmony/entry/ets/common/ui/UiTheme";
export class PagedListView extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__status = new SynchedPropertySimpleOneWayPU(params.status, this, "status");
        this.__message = new SynchedPropertySimpleOneWayPU(params.message, this, "message");
        this.__isLoadingMore = new SynchedPropertySimpleOneWayPU(params.isLoadingMore, this, "isLoadingMore");
        this.__showLoadMore = new SynchedPropertySimpleOneWayPU(params.showLoadMore, this, "showLoadMore");
        this.__loadMoreText = new SynchedPropertySimpleOneWayPU(params.loadMoreText, this, "loadMoreText");
        this.retryAction = undefined;
        this.loadMoreAction = undefined;
        this.content = undefined;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: PagedListView_Params) {
        if (params.status === undefined) {
            this.__status.set(LoadStatus.Idle);
        }
        if (params.message === undefined) {
            this.__message.set('');
        }
        if (params.isLoadingMore === undefined) {
            this.__isLoadingMore.set(false);
        }
        if (params.showLoadMore === undefined) {
            this.__showLoadMore.set(true);
        }
        if (params.loadMoreText === undefined) {
            this.__loadMoreText.set(AppText.LOAD_MORE);
        }
        if (params.retryAction !== undefined) {
            this.retryAction = params.retryAction;
        }
        if (params.loadMoreAction !== undefined) {
            this.loadMoreAction = params.loadMoreAction;
        }
        if (params.content !== undefined) {
            this.content = params.content;
        }
    }
    updateStateVars(params: PagedListView_Params) {
        this.__status.reset(params.status);
        this.__message.reset(params.message);
        this.__isLoadingMore.reset(params.isLoadingMore);
        this.__showLoadMore.reset(params.showLoadMore);
        this.__loadMoreText.reset(params.loadMoreText);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__status.purgeDependencyOnElmtId(rmElmtId);
        this.__message.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoadingMore.purgeDependencyOnElmtId(rmElmtId);
        this.__showLoadMore.purgeDependencyOnElmtId(rmElmtId);
        this.__loadMoreText.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__status.aboutToBeDeleted();
        this.__message.aboutToBeDeleted();
        this.__isLoadingMore.aboutToBeDeleted();
        this.__showLoadMore.aboutToBeDeleted();
        this.__loadMoreText.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __status: SynchedPropertySimpleOneWayPU<LoadStatus>;
    get status() {
        return this.__status.get();
    }
    set status(newValue: LoadStatus) {
        this.__status.set(newValue);
    }
    private __message: SynchedPropertySimpleOneWayPU<string>;
    get message() {
        return this.__message.get();
    }
    set message(newValue: string) {
        this.__message.set(newValue);
    }
    private __isLoadingMore: SynchedPropertySimpleOneWayPU<boolean>;
    get isLoadingMore() {
        return this.__isLoadingMore.get();
    }
    set isLoadingMore(newValue: boolean) {
        this.__isLoadingMore.set(newValue);
    }
    private __showLoadMore: SynchedPropertySimpleOneWayPU<boolean>;
    get showLoadMore() {
        return this.__showLoadMore.get();
    }
    set showLoadMore(newValue: boolean) {
        this.__showLoadMore.set(newValue);
    }
    private __loadMoreText: SynchedPropertySimpleOneWayPU<string>;
    get loadMoreText() {
        return this.__loadMoreText.get();
    }
    set loadMoreText(newValue: string) {
        this.__loadMoreText.set(newValue);
    }
    private retryAction?: () => void;
    private loadMoreAction?: () => void;
    private __content;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(1);
        }, Column);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new StateView(this, {
                        status: this.status,
                        message: this.message,
                        retryAction: this.retryAction,
                        content: () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                List.create({ space: 10 });
                                List.padding({ left: 12, right: 12, bottom: 12 });
                            }, List);
                            this.content.bind(this)();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                If.create();
                                if (this.status === LoadStatus.Success && this.showLoadMore) {
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
                                                    Button.createWithLabel(this.isLoadingMore ? AppText.LOADING : this.loadMoreText);
                                                    Button.width('100%');
                                                    Button.enabled(!this.isLoadingMore);
                                                    Button.type(ButtonType.Capsule);
                                                    Button.backgroundColor(UiTheme.BRAND_PRIMARY);
                                                    Button.fontColor('#FFFFFF');
                                                    Button.onClick(() => {
                                                        if (this.loadMoreAction) {
                                                            this.loadMoreAction();
                                                        }
                                                    });
                                                }, Button);
                                                Button.pop();
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
                            List.pop();
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/common/ui/components/PagedListView.ets", line: 19, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            status: this.status,
                            message: this.message,
                            retryAction: this.retryAction,
                            content: () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    List.create({ space: 10 });
                                    List.padding({ left: 12, right: 12, bottom: 12 });
                                }, List);
                                this.content.bind(this)();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    If.create();
                                    if (this.status === LoadStatus.Success && this.showLoadMore) {
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
                                                        Button.createWithLabel(this.isLoadingMore ? AppText.LOADING : this.loadMoreText);
                                                        Button.width('100%');
                                                        Button.enabled(!this.isLoadingMore);
                                                        Button.type(ButtonType.Capsule);
                                                        Button.backgroundColor(UiTheme.BRAND_PRIMARY);
                                                        Button.fontColor('#FFFFFF');
                                                        Button.onClick(() => {
                                                            if (this.loadMoreAction) {
                                                                this.loadMoreAction();
                                                            }
                                                        });
                                                    }, Button);
                                                    Button.pop();
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
                                List.pop();
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        status: this.status,
                        message: this.message
                    });
                }
            }, { name: "StateView" });
        }
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
