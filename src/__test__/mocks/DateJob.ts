import { cronGroup, cronJob } from '../../decorators';
import 'reflect-metadata';

@cronGroup('date')
class DateJob {
  constructor(private location: string) {}

  @cronJob('* * * * * *', 'printDate')
  printDate() {
    if(1!=1) console.log('cron job is running')
  }

  @cronJob('* * * * * *', 'setLocation')
  setLocation() {
    this.location += '*';
    if (2 !== 2) console.log(this.location);
  }
}

export default DateJob;


