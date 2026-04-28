if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface PageHeader_Params {
    title?: string;
    showBack?: boolean;
    rightText?: string;
    onBack?: () => void;
    onRightClick?: () => void;
}
export class PageHeader extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__title = new SynchedPropertySimpleOneWayPU(params.title, this, "title");
        this.__showBack = new SynchedPropertySimpleOneWayPU(params.showBack, this, "showBack");
        this.__rightText = new SynchedPropertySimpleOneWayPU(params.rightText, this, "rightText");
        this.onBack = undefined;
        this.onRightClick = undefined;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: PageHeader_Params) {
        if (params.title === undefined) {
            this.__title.set('');
        }
        if (params.showBack === undefined) {
            this.__showBack.set(false);
        }
        if (params.rightText === undefined) {
            this.__rightText.set('');
        }
        if (params.onBack !== undefined) {
            this.onBack = params.onBack;
        }
        if (params.onRightClick !== undefined) {
            this.onRightClick = params.onRightClick;
        }
    }
    updateStateVars(params: PageHeader_Params) {
        this.__title.reset(params.title);
        this.__showBack.reset(params.showBack);
        this.__rightText.reset(params.rightText);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__title.purgeDependencyOnElmtId(rmElmtId);
        this.__showBack.purgeDependencyOnElmtId(rmElmtId);
        this.__rightText.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__title.aboutToBeDeleted();
        this.__showBack.aboutToBeDeleted();
        this.__rightText.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __title: SynchedPropertySimpleOneWayPU<string>;
    get title() {
        return this.__title.get();
    }
    set title(newValue: string) {
        this.__title.set(newValue);
    }
    private __showBack: SynchedPropertySimpleOneWayPU<boolean>;
    get showBack() {
        return this.__showBack.get();
    }
    set showBack(newValue: boolean) {
        this.__showBack.set(newValue);
    }
    private __rightText: SynchedPropertySimpleOneWayPU<string>;
    get rightText() {
        return this.__rightText.get();
    }
    set rightText(newValue: string) {
        this.__rightText.set(newValue);
    }
    private onBack?: () => void;
    private onRightClick?: () => void;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
            Row.width('100%');
            Row.padding({ left: 16, right: 16, top: 14, bottom: 8 });
            Row.backgroundColor(Color.White);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.showBack) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('返回');
                        Button.type(ButtonType.Capsule);
                        Button.onClick(() => {
                            if (this.onBack) {
                                this.onBack();
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
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.title);
            Text.fontSize(22);
            Text.fontWeight(FontWeight.Bold);
            Text.maxLines(1);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.rightText.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel(this.rightText);
                        Button.type(ButtonType.Capsule);
                        Button.onClick(() => {
                            if (this.onRightClick) {
                                this.onRightClick();
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
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
