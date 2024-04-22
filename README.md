# duplojs-zod-accelerator
[![NPM version](https://img.shields.io/npm/v/@duplojs/zod-accelerator)](https://www.npmjs.com/package/@duplojs/zod-accelerator)

## Instalation
```
npm i @duplojs/zod-accelerator
```

## Benchmarck
![Benchmarck result](/benchmarck-result.png)

## Utilisation
```ts
import * as zod from "zod";
import {ZodAccelerator} from "@duplojs/zod-accelerator";

const zodSchema = zod.object({
    firstname: zod.string(),
    lastname: zod.string(),
    age: zod.number(),
    email: zod.string(),
    gender: zod.enum(["boy", "girl"]),
    connected: zod.boolean(),
    createdAt: zod.date(),
    addresse: zod.object({
        postCode: zod.string(),
        city: zod.string(),
        number: zod.number()
    }),
}).array();

const zodAccelerateSchema = ZodAccelerator.build(zodSchema);

const inputData = Array.from({length: 10}).fill({
    firstname: "  Mike ",
    lastname: "ee",
    age: 21,
    email: "test@gmail.com",
    gender: "girl",
    connected: true,
    createdAt: new Date(),
    addresse: {
        postCode: "22778",
        city: "Paris",
        number: 67
    },
});

const outputData = zodAccelerateSchema.parse(inputData);
```

## Implémentation dans duplojs
```ts
import Duplo, {zod} from "@duplojs/duplojs";
import duploZodAccelerator from "@duplojs/zod-accelerator/plugin";

const duplo = Duplo({port: 1506, host: "localhost", environment: "DEV"});

duplo.use(duploZodAccelerator, {DEV: true});
```