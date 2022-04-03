"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronManager = void 0;
var node_cron_1 = require("node-cron");
var decorators_1 = require("./decorators");
var CronManager = /** @class */ (function () {
    function CronManager() {
        var _this = this;
        this.instanceMap = new Map();
        this.handlerTagCronJobMap = new Map();
        this.groupTagCronJobMap = new Map();
        this.allJobs = [];
        this.initialized = false;
        var groups = Reflect.getMetadata(decorators_1.GROUP_SYMBOL, Reflect) || [];
        //initially instantiate each classname instance to null
        groups.forEach(function (value) {
            var className = value.className;
            if (_this.instanceMap.has(className))
                throw new Error("duplicate key for ".concat(className));
            _this.instanceMap.set(className, null);
        });
    }
    CronManager.prototype.register = function (Class, instance) {
        if (!this.instanceMap.has(Class.name))
            throw new Error("class ".concat(Class.name, " has not been decorated with @cronGroup"));
        if (Class.name !== instance.constructor.name)
            throw new Error("instance is not of type ".concat(Class.name));
        this.instanceMap.set(Class.name, instance);
    };
    CronManager.prototype.init = function () {
        var _this = this;
        if (this.initialized)
            return;
        var groups = Reflect.getMetadata(decorators_1.GROUP_SYMBOL, Reflect) || [];
        //get the handlers for each group and then add their handlers to the right places
        groups.forEach(function (value) {
            var groupTag = value.groupTag, constructor = value.constructor;
            var handlers = Reflect.getMetadata(decorators_1.JOB_SYMBOL, constructor) || [];
            //for each handler create the scheduled task and add it into all jobs first
            handlers.forEach(function (handler) {
                var func = handler.func, cronExpression = handler.cronExpression, className = handler.className, handlerTag = handler.handlerTag;
                if (!_this.instanceMap.has(className))
                    throw new Error("class ".concat(className, " was not decorateed with cronGroup tag"));
                var instance = _this.instanceMap.get(className);
                if (!instance)
                    throw new Error("class ".concat(className, " has not been registered"));
                var job = (0, node_cron_1.schedule)(cronExpression, func.bind(instance), { scheduled: false });
                _this.allJobs.push(job); //add the job to the global list of jobs.
                //add to the group tags list.
                if (groupTag) {
                    var jobs = _this.groupTagCronJobMap.get(groupTag) || [];
                    jobs.push(job);
                    _this.groupTagCronJobMap.set(groupTag, jobs);
                }
                //set the job for that specific handler tag;
                if (handlerTag) {
                    if (_this.handlerTagCronJobMap.has(handlerTag))
                        throw new Error("tag ".concat(handlerTag, " is already in use"));
                    _this.handlerTagCronJobMap.set(handlerTag, job);
                }
            });
        });
        this.initialized = true;
    };
    CronManager.prototype.startAll = function () {
        this.init();
        this.allJobs.forEach(function (job) {
            job.start();
        });
    };
    CronManager.prototype.stopAll = function () {
        this.init();
        this.allJobs.forEach(function (job) {
            job.stop();
        });
    };
    CronManager.prototype.startGroupLogic = function (groupTag, start) {
        if (start === void 0) { start = true; }
        this.init();
        if (!this.groupTagCronJobMap.has(groupTag))
            throw new Error("group tag ".concat(groupTag, " not found"));
        var jobs = this.groupTagCronJobMap.get(groupTag) || [];
        jobs === null || jobs === void 0 ? void 0 : jobs.forEach(function (job) {
            if (start)
                job.start();
            else
                job.stop();
        });
    };
    CronManager.prototype.startHandlerLogic = function (handlerTag, start) {
        if (start === void 0) { start = true; }
        this.init();
        if (!this.handlerTagCronJobMap.has(handlerTag))
            throw new Error("handler tag ".concat(handlerTag, " not found"));
        var job = this.handlerTagCronJobMap.get(handlerTag);
        if (start)
            job === null || job === void 0 ? void 0 : job.start();
        else
            job === null || job === void 0 ? void 0 : job.stop();
    };
    CronManager.prototype.startGroup = function (groupTag) {
        this.startGroupLogic(groupTag);
    };
    CronManager.prototype.stopGroup = function (groupTag) {
        this.startGroupLogic(groupTag, false);
    };
    CronManager.prototype.startHandler = function (handlerTag) {
        this.startHandlerLogic(handlerTag);
    };
    CronManager.prototype.stopHandler = function (handlerTag) {
        this.startHandlerLogic(handlerTag, false);
    };
    return CronManager;
}());
exports.CronManager = CronManager;
