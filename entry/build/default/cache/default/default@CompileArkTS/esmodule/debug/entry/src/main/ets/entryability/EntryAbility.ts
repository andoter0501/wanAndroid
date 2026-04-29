import UIAbility from "@ohos:app.ability.UIAbility";
import type window from "@ohos:window";
import { ExploreLogger } from "@bundle:com.wanandroid.harmony/entry/ets/common/log/ExploreLogger";
export default class EntryAbility extends UIAbility {
    onWindowStageCreate(windowStage: window.WindowStage): void {
        windowStage.loadContent('pages/Index', (err) => {
            if (err.code) {
                ExploreLogger.error('EntryAbility', `Failed to load the content. Cause: ${JSON.stringify(err)}`);
            }
        });
    }
}
