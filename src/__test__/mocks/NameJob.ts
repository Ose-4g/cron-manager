import { cronGroup, cronJob } from '../../decorators';
import 'reflect-metadata';

@cronGroup('name')
class NameJob {
  constructor(private name: string) {}

  @cronJob('*/2 * * * * *', 'printName')
  printName() {
    if (1 !== 1) console.log(this.name);
  }
}

export default NameJob;

