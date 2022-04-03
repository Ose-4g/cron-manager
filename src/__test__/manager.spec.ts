import 'reflect-metadata';
import { CronManager } from '../CronManager';
import DateJob from './mocks/DateJob';
import NameJob from './mocks/NameJob';
import * as sinon from 'sinon';
import { afterEach } from 'mocha';
import { assert } from 'chai';

const manager = new CronManager();
const nameJob = new NameJob('ose4g');
const dateJob = new DateJob('Nigeria')
manager.register(DateJob, dateJob)
manager.register(NameJob, nameJob)
const sandbox = sinon.createSandbox();
let clock:sinon.SinonFakeTimers;

describe('Test For CronManager ', () => {
  beforeEach(()=>{
    clock = sinon.useFakeTimers()
    dateJob.count1 = 0;
    dateJob.count2 = 0;
    nameJob.count = 0;
  })
  afterEach(() => {
    if(clock) clock.restore()
    sandbox.restore()
  });

  it('startAll() should start  all the handlers and stopAll() should stop all handlers',async()=>{
    manager.startAll()
    await clock.tick(10000);
    manager.stopAll();
    await clock.tick(2000)
    assert.equal(dateJob.count1,10)
    assert.equal(dateJob.count2,10)
    assert.equal(nameJob.count,5)
  })

  it('startGroup() should throw error when called with invalid group',(done)=>{
    try {
      manager.startGroup('invalid') 
    } catch (error) {
      assert.include((error as Error).message, 'not found')
      assert.include((error as Error).message, 'invalid')
      done()
    }
  })

  it('startGroup() should start  all the handlers for a group only',async()=>{
    manager.startGroup('date')
    await clock.tick(10000);
    manager.stopAll();
    await clock.tick(2000)
    assert.equal(dateJob.count1,10)
    assert.equal(dateJob.count2,10)
    assert.equal(nameJob.count,0)
  })

  it('stopGroup() should stop all handlers only for a specific group', async()=>{
    manager.startAll();
    await clock.tick(10000);
    manager.stopGroup('date');
    await clock.tick(2000);
    manager.stopAll();
    assert.equal(dateJob.count1, 10)
    assert.equal(dateJob.count2, 10)
    assert.equal(nameJob.count, 6)
  })

  it('startHandler() should throw error when called with invalid handlerTag',(done)=>{
    try {
      manager.startHandler('invalid') 
    } catch (error) {
      assert.include((error as Error).message, 'not found')
      assert.include((error as Error).message, 'invalid')
      done()
    }
  })

  it('startHandler() should start  only that specific handler',async()=>{
    manager.startHandler('printDate')
    await clock.tick(10000);
    manager.stopAll();
    await clock.tick(2000)
    assert.equal(dateJob.count1,10)
    assert.equal(dateJob.count2,0)
    assert.equal(nameJob.count,0)
  })

  it('stopHandler() should stop only the speicif handler', async()=>{
    manager.startAll();
    await clock.tick(10000);
    manager.stopHandler('printDate');
    await clock.tick(2000);
    manager.stopAll();
    assert.equal(dateJob.count1, 10)
    assert.equal(dateJob.count2, 12)
    assert.equal(nameJob.count, 6)
  })
});
