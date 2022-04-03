import 'reflect-metadata';
export declare const GROUP_SYMBOL: unique symbol;
export interface Group {
    groupTag: string | undefined;
    constructor: Function;
    className: string;
}
export declare function cronGroup(groupTag?: string): ClassDecorator;
