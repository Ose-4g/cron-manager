# @ose4g/cron-manager

This package is a package to manage cron-jobs in a node.js **Typescript** application.

## Installation

```bash
npm i @ose4g/cron-manager
```

## Usage
The package works with decorators and hance the following lines should be  in your tsconfig.json file    
```
"experimentalDecorators": true,       
"emitDecoratorMetadata": true, 
```

Annotate your Job class with **@cronGroup** and annotate each handler with **@cronJob**

```
import 'reflect-metadata'

class
```
