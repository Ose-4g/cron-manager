import { cronGroup, cronJob } from '../../decorators';
import 'reflect-metadata';

@cronGroup('name')
class NameJob {
  count = 0;
  constructor(private name: string) {}

  @cronJob('*/2 * * * * *', 'printName')
  printName() {
    this.count++;
    if (1 !== 1) console.log(this.name);
  }
}

export default NameJob;
