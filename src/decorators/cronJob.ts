import 'reflect-metadata';
import * as cron from 'node-cron';

export const JOB_SYMBOL = Symbol('job');
export interface Handler {
  handlerTag: string | undefined;
  cronExpression: string;
  func: any;
  constructor: Function;
  className: string;
}

export function cronJob(cronExpression: string, handlerTag?: string): MethodDecorator {
  return function (target: Object, propertyKey: string | Symbol, descriptor: PropertyDescriptor) {
    const isValid = cron.validate(cronExpression);
    if (!isValid) throw new Error(`${cronExpression} is not a valid cron expression`);
    const allHandlers: Handler[] = Reflect.getMetadata(JOB_SYMBOL, target.constructor) || [];

    allHandlers.push({
      handlerTag,
      cronExpression,
      func: descriptor.value,
      constructor: target.constructor,
      className: target.constructor.name,
    });
    Reflect.defineMetadata(JOB_SYMBOL, allHandlers, target.constructor);
  };
}
