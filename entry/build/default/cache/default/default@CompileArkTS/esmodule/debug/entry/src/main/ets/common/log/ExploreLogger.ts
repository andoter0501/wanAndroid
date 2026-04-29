import { DEBUG } from "@bundle:com.wanandroid.harmony/entry/build/default/generated/profile/default/BuildProfile";
export class ExploreLogger {
    private static enabled: boolean = DEBUG;
    static setEnabled(enabled: boolean): void {
        ExploreLogger.enabled = enabled;
    }
    static info(tag: string, message: string): void {
        if (!ExploreLogger.enabled) {
            return;
        }
        console.info(`[Explore/${tag}] ${message}`);
    }
    static error(tag: string, message: string): void {
        if (!ExploreLogger.enabled) {
            return;
        }
        console.error(`[Explore/${tag}] ${message}`);
    }
}
