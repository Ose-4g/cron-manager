# @ose4g/cron-manager

[![https://nodei.co/npm/@ose4g/cron-manager.png?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/@ose4g/cron-manager.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/@ose4g/cron-manager)   
This package is a package to manage cron-jobs in a node.js **Typescript** application. It is built using [node-cron](https://www.npmjs.com/package/node-cron) and [reflect-metadata](https://www.npmjs.com/package/reflect-metadata) packages

## Installation

```bash
npm i @ose4g/cron-manager
```

## Usage

The package works with decorators and hance the following lines should be in your tsconfig.json file

```javascript
"experimentalDecorators": true,
"emitDecoratorMetadata": true,
```

Annotate your Job class with **@cronGroup** and annotate each handler with **@cronJob**

```javascript
import { cronGroup, cronJob, CronManager } from "@ose4g/cron-manager";


@cronGroup('jobs')
class JobService{
    constructor(private name:string){}

    @cronJob('*/1 * * * * *','print_name_func')
    printName(){
        console.log(this.name)
    }
}

@cronGroup('auth')
class AuthService{
    constructor(private users: any[]){}

    @cronJob('* * * * * *','my_unban_func')
    unbanUser(){
        console.log(`There are ${this.users.length} users in the application`)
    }
}
const manager = new CronManager();

const jobService = new JobService('Ose4g');
const authJob = new AuthService([])

manager.register(JobService, jobService)
manager.register(AuthService,authJob)


manager.startAll() //starts all jobs
manager.stopAll() //stops all jobs

//starting and stopping for specific groups
manager.startGroup('jobs') //starts only jobs in the class with tag equal to jobs
manager.stopGroup('jobs') //stops only jobs in the class with grouptag equal to jobs

//starting and stopping for specific handlers or jobs
manager.startHandler('my_unban_func') //starts the single job with tag equal to my_unban_func
manager.stopHandler('my_unban_func') //stop the single job with tag equal to my_unban_func

```

## Methods

- **@cronGroup( groupTag? : string )**  
   params
  - **groupTag**: tag to uniquely identify a a set of jobs. The same groupTag can be used for multiple classes. <br><br>
- **@cronJob( cronExpression: string, handlerTag?: string)**  
   params
  - **cronExpression**: Expression describing the cron interval. The package uses [node-cron](https://www.npmjs.com/package/node-cron) in the background and hence the expression description is the same.
  - **handlerTag**: unique string to identify a single job. The job can be started and stopped using that tag. <br><br>
- **manager.register(Class:Function, instance: any)**  
   It registers an instance of a class to the cron job manager.  
   params
  - **Class**: The class we're registering
  - **instance**: An instance of that class
