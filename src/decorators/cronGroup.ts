import 'reflect-metadata';
export const GROUP_SYMBOL = Symbol('group')

export interface Group{
  groupTag: string | undefined;
  constructor: Function;
  className: string
}
export function cronGroup(groupTag?: string): ClassDecorator {
  return function (constructor: Function) {
    const groups:Group[] = Reflect.getMetadata(GROUP_SYMBOL, Reflect) || [];
    groups.push({ groupTag, constructor, className: constructor.name });
    Reflect.defineMetadata(GROUP_SYMBOL, groups, Reflect);
  };
}
