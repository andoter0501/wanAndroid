if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface WebDetailPage_Params {
    url?: string;
    onBack?: () => void;
    tip?: string;
    block?: boolean;
    safeUrl?: string;
    controller?: webview.WebviewController;
}
import { PageHeader } from "@bundle:com.wanandroid.harmony/entry/ets/common/ui/components/PageHeader";
import { UrlSecurityGuard } from "@bundle:com.wanandroid.harmony/entry/ets/common/web/UrlSecurityGuard";
import webview from "@ohos:web.webview";
export class WebDetailPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__url = new SynchedPropertySimpleOneWayPU(params.url, this, "url");
        this.onBack = undefined;
        this.__tip = new ObservedPropertySimplePU('', this, "tip");
        this.__block = new ObservedPropertySimplePU(false, this, "block");
        this.__safeUrl = new ObservedPropertySimplePU('', this, "safeUrl");
        this.controller = new webview.WebviewController();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: WebDetailPage_Params) {
        if (params.onBack !== undefined) {
            this.onBack = params.onBack;
        }
        if (params.tip !== undefined) {
            this.tip = params.tip;
        }
        if (params.block !== undefined) {
            this.block = params.block;
        }
        if (params.safeUrl !== undefined) {
            this.safeUrl = params.safeUrl;
        }
        if (params.controller !== undefined) {
            this.controller = params.controller;
        }
    }
    updateStateVars(params: WebDetailPage_Params) {
        this.__url.reset(params.url);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__url.purgeDependencyOnElmtId(rmElmtId);
        this.__tip.purgeDependencyOnElmtId(rmElmtId);
        this.__block.purgeDependencyOnElmtId(rmElmtId);
        this.__safeUrl.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__url.aboutToBeDeleted();
        this.__tip.aboutToBeDeleted();
        this.__block.aboutToBeDeleted();
        this.__safeUrl.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __url: SynchedPropertySimpleOneWayPU<string>;
    get url() {
        return this.__url.get();
    }
    set url(newValue: string) {
        this.__url.set(newValue);
    }
    private onBack?: () => void;
    private __tip: ObservedPropertySimplePU<string>;
    get tip() {
        return this.__tip.get();
    }
    set tip(newValue: string) {
        this.__tip.set(newValue);
    }
    private __block: ObservedPropertySimplePU<boolean>;
    get block() {
        return this.__block.get();
    }
    set block(newValue: boolean) {
        this.__block.set(newValue);
    }
    private __safeUrl: ObservedPropertySimplePU<string>;
    get safeUrl() {
        return this.__safeUrl.get();
    }
    set safeUrl(newValue: string) {
        this.__safeUrl.set(newValue);
    }
    private controller: webview.WebviewController;
    aboutToAppear(): void {
        const result = UrlSecurityGuard.check(this.url);
        this.block = !result.allow;
        this.tip = result.reason;
        this.safeUrl = result.allow ? this.url : '';
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
                        title: '网页详情',
                        showBack: true,
                        onBack: () => {
                            if (this.onBack) {
                                this.onBack();
                            }
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/features/web/WebDetailPage.ets", line: 24, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            title: '网页详情',
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
                        title: '网页详情',
                        showBack: true
                    });
                }
            }, { name: "PageHeader" });
        }
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.tip.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.tip);
                        Text.fontSize(12);
                        Text.fontColor(this.block ? '#C0392B' : '#C97A00');
                        Text.width('100%');
                        Text.padding({ left: 12, right: 12, top: 8, bottom: 8 });
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
            if (this.block) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.layoutWeight(1);
                        Column.width('100%');
                        Column.justifyContent(FlexAlign.Center);
                        Column.padding(20);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('链接已被安全策略拦截');
                        Text.fontSize(16);
                        Text.fontWeight(FontWeight.Medium);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.url);
                        Text.fontSize(12);
                        Text.margin({ top: 8 });
                        Text.fontColor('#666666');
                        Text.maxLines(2);
                        Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Web.create({
                            src: this.safeUrl,
                            controller: this.controller
                        });
                        Web.layoutWeight(1);
                        Web.width('100%');
                    }, Web);
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
