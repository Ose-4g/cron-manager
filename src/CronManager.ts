import { ScheduledTask, schedule } from 'node-cron';
import { Group, GROUP_SYMBOL, Handler, JOB_SYMBOL } from './decorators';
export class CronManager {
  private instanceMap: Map<string, any> = new Map();
  private handlerTagCronJobMap: Map<string, ScheduledTask> = new Map();
  private groupTagCronJobMap: Map<string, ScheduledTask[]> = new Map();
  private allJobs: ScheduledTask[] = [];
  private initialized: boolean = false;

  constructor() {
    const groups: Group[] = Reflect.getMetadata(GROUP_SYMBOL, Reflect) || [];

    //initially instantiate each classname instance to null
    groups.forEach((value) => {
      const { className } = value;
      if (this.instanceMap.has(className)) throw new Error(`duplicate key for ${className}`);
      this.instanceMap.set(className, null);
    });
  }

  /**
   * Registers an instance to a class
   * @param Class : The Class
   * @param instance : Instance of the class given
   */
  register(Class: Function, instance: any): void {
    if (!this.instanceMap.has(Class.name))
      throw new Error(`class ${Class.name} has not been decorated with @cronGroup`);
    if (Class.name !== instance.constructor.name) throw new Error(`instance is not of type ${Class.name}`);
    this.instanceMap.set(Class.name, instance);
  }

  /**
   * gets all the handlers and adds them to the various Maps and lists in the appropriate manner
   * @returns void
   */
  private init() {
    if (this.initialized) return;

    const groups: Group[] = Reflect.getMetadata(GROUP_SYMBOL, Reflect) || [];

    //get the handlers for each group and then add their handlers to the right places
    groups.forEach((value) => {
      const { groupTag, constructor } = value;

      const handlers: Handler[] = Reflect.getMetadata(JOB_SYMBOL, constructor) || [];

      //for each handler create the scheduled task and add it into all jobs first
      handlers.forEach((handler) => {
        const { func, cronExpression, className, handlerTag } = handler;
        if (!this.instanceMap.has(className))
          throw new Error(`class ${className} was not decorateed with cronGroup tag`);
        const instance = this.instanceMap.get(className);
        if (!instance) throw new Error(`class ${className} has not been registered`);
        const job = schedule(cronExpression, ()=>{
          instance[func]();
        }, { scheduled: false });

        this.allJobs.push(job); //add the job to the global list of jobs.

        //add to the group tags list.
        if (groupTag) {
          const jobs = this.groupTagCronJobMap.get(groupTag) || [];
          jobs.push(job);
          this.groupTagCronJobMap.set(groupTag, jobs);
        }

        //set the job for that specific handler tag;
        if (handlerTag) {
          if (this.handlerTagCronJobMap.has(handlerTag)) throw new Error(`tag ${handlerTag} is already in use`);
          this.handlerTagCronJobMap.set(handlerTag, job);
        }
      });
    });

    this.initialized = true;
  }

  /**
   * starts all cron jobs
   */
  startAll() {
    this.init();
    this.allJobs.forEach((job) => {
      job.start();
    });
  }

  /**
   * stops all cron jobs
   */
  stopAll() {
    this.init();
    this.allJobs.forEach((job) => {
      job.stop();
    });
  }

  /**
   * starts or stops all jobs defined in a group with groupTag = groupTag
   * @param groupTag : unique tag of the group
   * @param start : set to true to start the job. Set to false to stop the job. it defaults to true if not set.
   */
  private startGroupLogic(groupTag: string, start = true) {
    this.init();
    if (!this.groupTagCronJobMap.has(groupTag)) throw new Error(`group tag ${groupTag} not found`);
    const jobs = this.groupTagCronJobMap.get(groupTag) || [];

    jobs?.forEach((job) => {
      if (start) job.start();
      else job.stop();
    });
  }

  /**
   *
   * @param handlerTag unique tag of the handler
   * @param start set to true to start the job. Set to false to stop the job. it defaults to true if not set.
   */
  private startHandlerLogic(handlerTag: string, start = true) {
    this.init();
    if (!this.handlerTagCronJobMap.has(handlerTag)) throw new Error(`handler tag ${handlerTag} not found`);
    const job = this.handlerTagCronJobMap.get(handlerTag);

    if (start) job?.start();
    else job?.stop();
  }

  /**
   * Starts all jobs with groupTag
   * @param groupTag
   */
  startGroup(groupTag: string) {
    this.startGroupLogic(groupTag);
  }

  /**
   * Stops all jobs with group groupTag
   * @param groupTag
   */
  stopGroup(groupTag: string) {
    this.startGroupLogic(groupTag, false);
  }

  /**
   * Starts the job with handlerTag
   * @param handlerTag
   */
  startHandler(handlerTag: string) {
    this.startHandlerLogic(handlerTag);
  }

  /**
   * stops the job with handlerTag
   * @param handlerTag
   */
  stopHandler(handlerTag: string) {
    this.startHandlerLogic(handlerTag, false);
  }
}
