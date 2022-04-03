import 'reflect-metadata';
export const GROUP_SYMBOL = Symbol('group');

export interface Group {
  groupTag: string | undefined;
  constructor: Function;
  className: string;
}
/**
 * Decorator for the Cron Job class
 * @param groupTag 'tag of the group. It is used to uniquely identify this class so that all jobs in the class can be started or stoppoed using this key
 * @returns A class Decorator
 */
export function cronGroup(groupTag?: string): ClassDecorator {
  return function (constructor: Function) {
    const groups: Group[] = Reflect.getMetadata(GROUP_SYMBOL, Reflect) || [];
    groups.push({ groupTag, constructor, className: constructor.name });
    Reflect.defineMetadata(GROUP_SYMBOL, groups, Reflect);
  };
}
