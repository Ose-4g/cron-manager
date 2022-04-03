'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.cronGroup = void 0;
require('reflect-metadata');
function cronGroup(groupName) {
  return function (constructor) {
    console.log('I got into the class decorator');
    var groups = Reflect.getMetadata(Symbol('groups'), Reflect) || [];
    groups.push({ groupName: groupName, constructor: constructor });
    console.log('still in the function', groups);
    Reflect.defineMetadata(Symbol('groups'), groups, Reflect);
  };
}
exports.cronGroup = cronGroup;
