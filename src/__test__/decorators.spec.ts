import 'reflect-metadata';
import { Group, GROUP_SYMBOL, Handler, JOB_SYMBOL } from '../decorators';
import './mocks';
import * as chai from 'chai';
import DateJob from './mocks/DateJob';
import NameJob from './mocks/NameJob';

const assert = chai.assert;

describe('Test For Decorators', () => {
  it('It should save all group tags for the groups', (done) => {
    const groups: Group[] = Reflect.getMetadata(GROUP_SYMBOL, Reflect) || [];
    assert.equal(groups.length, 2);

    groups.forEach((val) => {
      const { className, groupTag, constructor } = val;
      assert.typeOf(constructor, 'function');
      assert.isTrue(className === DateJob.name || className === NameJob.name);
      assert.isTrue(constructor === DateJob || constructor === NameJob);
      assert.isTrue(groupTag === 'date' || groupTag === 'name');
    });
    done();
  });
  it('It should save handlers for each of the groups', (done) => {
    const nameHandlers: Handler[] = Reflect.getMetadata(JOB_SYMBOL, NameJob) || [];
    const dateHandlers: Handler[] = Reflect.getMetadata(JOB_SYMBOL, DateJob) || [];

    assert.equal(nameHandlers.length, 1);
    assert.equal(dateHandlers.length, 2);
    done();
  });
});
