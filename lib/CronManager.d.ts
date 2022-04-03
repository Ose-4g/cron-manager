export declare class CronManager {
    private instanceMap;
    private handlerTagCronJobMap;
    private groupTagCronJobMap;
    private allJobs;
    private initialized;
    constructor();
    register(Class: Function, instance: any): void;
    private init;
    startAll(): void;
    stopAll(): void;
    private startGroupLogic;
    private startHandlerLogic;
    startGroup(groupTag: string): void;
    stopGroup(groupTag: string): void;
    startHandler(handlerTag: string): void;
    stopHandler(handlerTag: string): void;
}
