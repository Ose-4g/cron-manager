"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cronJob = exports.JOB_SYMBOL = void 0;
require("reflect-metadata");
var cron = require("node-cron");
exports.JOB_SYMBOL = Symbol('job');
function cronJob(cronExpression, handlerTag) {
    return function (target, propertyKey, descriptor) {
        var isValid = cron.validate(cronExpression);
        if (!isValid)
            throw new Error("".concat(cronExpression, " is not a valid cron expression"));
        var allHandlers = Reflect.getMetadata(exports.JOB_SYMBOL, target.constructor) || [];
        allHandlers.push({
            handlerTag: handlerTag,
            cronExpression: cronExpression,
            func: descriptor.value,
            constructor: target.constructor,
            className: target.constructor.name,
        });
        Reflect.defineMetadata(exports.JOB_SYMBOL, allHandlers, target.constructor);
    };
}
exports.cronJob = cronJob;
