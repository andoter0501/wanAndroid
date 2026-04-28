if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ArticleCard_Params {
    article?: ArticleCardData;
    collected?: boolean;
    showCollectAction?: boolean;
    clickAction?: () => void;
    toggleCollectAction?: () => void;
}
export interface ArticleCardData {
    id: number;
    title: string;
    author?: string;
    shareUser?: string;
    niceDate?: string;
}
export class ArticleCard extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__article = new SynchedPropertyObjectOneWayPU(params.article, this, "article");
        this.__collected = new SynchedPropertySimpleOneWayPU(params.collected, this, "collected");
        this.__showCollectAction = new SynchedPropertySimpleOneWayPU(params.showCollectAction, this, "showCollectAction");
        this.clickAction = undefined;
        this.toggleCollectAction = undefined;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ArticleCard_Params) {
        if (params.collected === undefined) {
            this.__collected.set(false);
        }
        if (params.showCollectAction === undefined) {
            this.__showCollectAction.set(false);
        }
        if (params.clickAction !== undefined) {
            this.clickAction = params.clickAction;
        }
        if (params.toggleCollectAction !== undefined) {
            this.toggleCollectAction = params.toggleCollectAction;
        }
    }
    updateStateVars(params: ArticleCard_Params) {
        this.__article.reset(params.article);
        this.__collected.reset(params.collected);
        this.__showCollectAction.reset(params.showCollectAction);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__article.purgeDependencyOnElmtId(rmElmtId);
        this.__collected.purgeDependencyOnElmtId(rmElmtId);
        this.__showCollectAction.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__article.aboutToBeDeleted();
        this.__collected.aboutToBeDeleted();
        this.__showCollectAction.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __article: SynchedPropertySimpleOneWayPU<ArticleCardData>;
    get article() {
        return this.__article.get();
    }
    set article(newValue: ArticleCardData) {
        this.__article.set(newValue);
    }
    private __collected: SynchedPropertySimpleOneWayPU<boolean>;
    get collected() {
        return this.__collected.get();
    }
    set collected(newValue: boolean) {
        this.__collected.set(newValue);
    }
    private __showCollectAction: SynchedPropertySimpleOneWayPU<boolean>;
    get showCollectAction() {
        return this.__showCollectAction.get();
    }
    set showCollectAction(newValue: boolean) {
        this.__showCollectAction.set(newValue);
    }
    private clickAction?: () => void;
    private toggleCollectAction?: () => void;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(14);
            Column.backgroundColor(Color.White);
            Column.borderRadius(10);
            Column.onClick(() => {
                if (this.clickAction) {
                    this.clickAction();
                }
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.article.title);
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.maxLines(2);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.margin({ top: 10 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.article.author || this.article.shareUser || '匿名');
            Text.fontSize(12);
            Text.fontColor('#666666');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.article.niceDate || '');
            Text.fontSize(12);
            Text.fontColor('#999999');
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.showCollectAction) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.margin({ top: 10 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel(this.collected ? '取消收藏' : '收藏');
                        Button.type(ButtonType.Capsule);
                        Button.onClick(() => {
                            if (this.toggleCollectAction) {
                                this.toggleCollectAction();
                            }
                        });
                    }, Button);
                    Button.pop();
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
    rerender() {
        this.updateDirtyElements();
    }
}
