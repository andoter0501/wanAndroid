if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface StateView_Params {
    status?: LoadStatus;
    message?: string;
    retryAction?: () => void;
    content?: () => void;
}
import { LoadStatus } from "@bundle:com.wanandroid.harmony/entry/ets/common/ui/LoadState";
import { AppText } from "@bundle:com.wanandroid.harmony/entry/ets/common/ui/AppText";
import { UiTheme } from "@bundle:com.wanandroid.harmony/entry/ets/common/ui/UiTheme";
function DefaultLoading(parent = null) {
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender) => {
        Column.create();
        Column.width('100%');
        Column.padding({ left: 16, right: 16, top: 24, bottom: 24 });
        Column.justifyContent(FlexAlign.Center);
    }, Column);
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender) => {
        Column.create({ space: 10 });
        Column.width('100%');
    }, Column);
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender) => {
        Row.create();
        Row.width('100%');
        Row.height(16);
        Row.backgroundColor(UiTheme.BG_SUBTLE);
        Row.borderRadius(6);
    }, Row);
    Row.pop();
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender) => {
        Row.create();
        Row.width('84%');
        Row.height(16);
        Row.backgroundColor(UiTheme.BG_SUBTLE);
        Row.borderRadius(6);
    }, Row);
    Row.pop();
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender) => {
        Row.create();
        Row.width('70%');
        Row.height(16);
        Row.backgroundColor(UiTheme.BG_SUBTLE);
        Row.borderRadius(6);
    }, Row);
    Row.pop();
    Column.pop();
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender) => {
        Text.create(AppText.LOADING);
        Text.fontSize(13);
        Text.fontColor(UiTheme.TEXT_SECONDARY);
        Text.margin({ top: 10 });
    }, Text);
    Text.pop();
    Column.pop();
}
function DefaultEmpty(message: string, parent = null) {
    const __message__ = message;
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender, message = __message__) => {
        Column.create();
        Column.width('100%');
        Column.padding(20);
        Column.justifyContent(FlexAlign.Center);
    }, Column);
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender, message = __message__) => {
        Text.create(AppText.EMPTY_TITLE);
        Text.fontSize(16);
        Text.fontWeight(FontWeight.Bold);
        Text.fontColor(UiTheme.TEXT_PRIMARY);
    }, Text);
    Text.pop();
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender, message = __message__) => {
        Text.create(message || AppText.EMPTY_DESC);
        Text.fontSize(13);
        Text.margin({ top: 6 });
        Text.fontColor(UiTheme.TEXT_SECONDARY);
    }, Text);
    Text.pop();
    Column.pop();
}
function DefaultError(message: string, onRetry?: () => void, parent = null) {
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender) => {
        Column.create();
        Column.width('100%');
        Column.padding(20);
        Column.justifyContent(FlexAlign.Center);
    }, Column);
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender) => {
        Text.create(AppText.ERROR_TITLE);
        Text.fontSize(16);
        Text.fontWeight(FontWeight.Bold);
        Text.fontColor(UiTheme.TEXT_PRIMARY);
    }, Text);
    Text.pop();
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender) => {
        Text.create(message || AppText.ERROR_DESC);
        Text.fontSize(13);
        Text.margin({ top: 6 });
        Text.fontColor(UiTheme.TEXT_SECONDARY);
    }, Text);
    Text.pop();
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender) => {
        Button.createWithLabel(AppText.RETRY);
        Button.type(ButtonType.Capsule);
        Button.backgroundColor(UiTheme.BRAND_PRIMARY);
        Button.fontColor('#FFFFFF');
        Button.margin({ top: 12 });
        Button.onClick(() => {
            if (onRetry) {
                onRetry();
            }
        });
    }, Button);
    Button.pop();
    Column.pop();
}
export class StateView extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__status = new SynchedPropertySimpleOneWayPU(params.status, this, "status");
        this.__message = new SynchedPropertySimpleOneWayPU(params.message, this, "message");
        this.retryAction = undefined;
        this.content = undefined;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: StateView_Params) {
        if (params.status === undefined) {
            this.__status.set(LoadStatus.Idle);
        }
        if (params.message === undefined) {
            this.__message.set('');
        }
        if (params.retryAction !== undefined) {
            this.retryAction = params.retryAction;
        }
        if (params.content !== undefined) {
            this.content = params.content;
        }
    }
    updateStateVars(params: StateView_Params) {
        this.__status.reset(params.status);
        this.__message.reset(params.message);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__status.purgeDependencyOnElmtId(rmElmtId);
        this.__message.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__status.aboutToBeDeleted();
        this.__message.aboutToBeDeleted();
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
    private retryAction?: () => void;
    private __content;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.status === LoadStatus.Loading || this.status === LoadStatus.Idle) {
                this.ifElseBranchUpdateFunction(0, () => {
                    DefaultLoading.bind(this)();
                });
            }
            else if (this.status === LoadStatus.Empty) {
                this.ifElseBranchUpdateFunction(1, () => {
                    DefaultEmpty.bind(this)(this.message);
                });
            }
            else if (this.status === LoadStatus.Error) {
                this.ifElseBranchUpdateFunction(2, () => {
                    DefaultError.bind(this)(this.message, this.retryAction);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(3, () => {
                    this.content.bind(this)();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
