import 'reflect-metadata';
import { CronManager } from '../CronManager';
import DateJob from './mocks/DateJob';
import NameJob from './mocks/NameJob';
import * as sinon from 'sinon';
import { afterEach } from 'mocha';
import { assert } from 'chai';

const manager = new CronManager();
const nameJob = new NameJob('ose4g');
const dateJob = new DateJob('Nigeria');
manager.register(DateJob, dateJob);
manager.register(NameJob, nameJob);
const sandbox = sinon.createSandbox();
let clock: sinon.SinonFakeTimers;

let printDateSpy: sinon.SinonSpy;
let setLocationSpy: sinon.SinonSpy;
let printNameSpy: sinon.SinonSpy;

describe('Test For CronManager ', () => {
  beforeEach(() => {
    clock = sinon.useFakeTimers();

    printDateSpy = sandbox.spy(dateJob, 'printDate');
    setLocationSpy = sandbox.spy(dateJob, 'setLocation');
    printNameSpy = sandbox.spy(nameJob, 'printName');
  });
  afterEach(() => {
    if (clock) clock.restore();
    sandbox.restore();
  });

  it('startAll() should start  all the handlers and stopAll() should stop all handlers', async () => {
    manager.startAll();
    await clock.tick(10000);
    manager.stopAll();
    await clock.tick(2000);
    assert.equal(10, printDateSpy.callCount);
    assert.equal(10, setLocationSpy.callCount);
    assert.equal(5, printNameSpy.callCount);
  });

  it('startGroup() should throw error when called with invalid group', (done) => {
    try {
      manager.startGroup('invalid');
    } catch (error) {
      assert.include((error as Error).message, 'not found');
      assert.include((error as Error).message, 'invalid');
      done();
    }
  });

  it('startGroup() should start  all the handlers for a group only', async () => {
    manager.startGroup('date');
    await clock.tick(10000);
    manager.stopAll();
    await clock.tick(2000);
    assert.equal(10, printDateSpy.callCount);
    assert.equal(10, setLocationSpy.callCount);
    assert.equal(0, printNameSpy.callCount);
  });

  it('stopGroup() should stop all handlers only for a specific group', async () => {
    manager.startAll();
    await clock.tick(10000);
    manager.stopGroup('date');
    await clock.tick(2000);
    manager.stopAll();
    assert.equal(10, printDateSpy.callCount);
    assert.equal(10, setLocationSpy.callCount);
    assert.equal(6, printNameSpy.callCount);
  });

  it('startHandler() should throw error when called with invalid handlerTag', (done) => {
    try {
      manager.startHandler('invalid');
    } catch (error) {
      assert.include((error as Error).message, 'not found');
      assert.include((error as Error).message, 'invalid');
      done();
    }
  });

  it('startHandler() should start  only that specific handler', async () => {
    manager.startHandler('printDate');
    await clock.tick(10000);
    manager.stopAll();
    await clock.tick(2000);
    assert.equal(10, printDateSpy.callCount);
    assert.equal(0, setLocationSpy.callCount);
    assert.equal(0, printNameSpy.callCount);
  });

  it('stopHandler() should stop only the specific handler', async () => {
    manager.startAll();
    await clock.tick(10000);
    manager.stopHandler('printDate');
    await clock.tick(2000);
    manager.stopAll();
    assert.equal(10, printDateSpy.callCount);
    assert.equal(12, setLocationSpy.callCount);
    assert.equal(6, printNameSpy.callCount);
  });

  it('it should get the number of handlers and groups', () => {
    const groups = manager.getGroups();
    const handlers = manager.getHandlers();
    assert.equal(groups.length, 2);
    assert.includeMembers(groups, ['date', 'name']);
    assert.equal(handlers.length, 3);
    assert.includeMembers(handlers, ['printDate', 'printName', 'setLocation']);
  });
});
