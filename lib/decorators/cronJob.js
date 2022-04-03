'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.cronJob = void 0;
require('reflect-metadata');
var cron = require('node-cron');
function cronJob(cronExpression, tag) {
  return function (target, propertyKey, descriptor) {
    cron.validate(cronExpression);
    var allJobs = Reflect.getMetadata(Symbol('cronJobs'), Reflect) || [];
    allJobs.push({ tag: tag, function: descriptor.value, constructor: target.constructor });
    Reflect.defineMetadata(Symbol('cronJobs'), allJobs, Reflect);
  };
}
exports.cronJob = cronJob;
