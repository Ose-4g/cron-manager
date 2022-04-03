import 'reflect-metadata';
export declare const JOB_SYMBOL: unique symbol;
export interface Handler {
    handlerTag: string | undefined;
    cronExpression: string;
    func: any;
    constructor: Function;
    className: string;
}
export declare function cronJob(cronExpression: string, handlerTag?: string): MethodDecorator;
