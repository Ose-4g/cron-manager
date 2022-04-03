import { cronGroup, cronJob } from '../../decorators';
import 'reflect-metadata';

@cronGroup('date')
class DateJob {
  count1 = 0;
  count2 = 0;
  constructor(private location: string) {}

  @cronJob('* * * * * *', 'printDate')
  printDate() {
    this.count1++;
  }

  @cronJob('* * * * * *', 'setLocation')
  setLocation() {
    this.location += '*';
    this.count2++;
    if (2 !== 2) console.log(this.location);
  }
}

export default DateJob;
