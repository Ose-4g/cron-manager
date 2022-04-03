"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cronGroup = exports.GROUP_SYMBOL = void 0;
require("reflect-metadata");
exports.GROUP_SYMBOL = Symbol('group');
function cronGroup(groupTag) {
    return function (constructor) {
        var groups = Reflect.getMetadata(exports.GROUP_SYMBOL, Reflect) || [];
        groups.push({ groupTag: groupTag, constructor: constructor, className: constructor.name });
        Reflect.defineMetadata(exports.GROUP_SYMBOL, groups, Reflect);
    };
}
exports.cronGroup = cronGroup;
