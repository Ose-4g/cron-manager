"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
describe('TEST FOR register METHOD IN CRON MANAGER', function () {
    it('Should throw error if some classs(es) have not been registered');
    it('Should throw error if a handler tag is used twice or more.');
    it('Cron job should be called multiple times');
    it('Cron jobs from other groups should not be running');
    it('Calling stopGroup should stop all jobs in the group');
});
