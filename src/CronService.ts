import 'reflect-metadata';
import { cronGroup, cronJob } from './decorators';
import { CronManager } from './CronManager';

@cronGroup('default')
class CronService {
  constructor(private name: string) {}

  @cronJob('*/2 * * * * *', 'first')
  printName() {
    console.log('calling the first');
  }

  @cronJob('* * * * * *', 'second')
  async printDate() {
    console.log(this.name);
  }
}

const service = new CronService("Ose4g's name");
const cronManager = new CronManager();
console.log(service.constructor.name);
cronManager.register(CronService, service);
cronManager.startGroup('default');
setTimeout(() => {
  cronManager.stopAll();
}, 10000);
