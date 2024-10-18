# @duplojs/zod-accelerator
[![NPM version](https://img.shields.io/npm/v/@duplojs/zod-accelerator)](https://www.npmjs.com/package/@duplojs/zod-accelerator)

## Installation
```
npm i @duplojs/zod-accelerator
```

## Benchmark
![Benchmarck result](/benchmarck-result.png)

## How to use it
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

## When should I use it
ZodAccelerator is useful when the schema is used multiple times during the same session. The time to build the custom function is about twice as long as its execution. If you only need to call your schema once, it might not be the best solution.

## How does it work
The `ZodAccelerator.build` function allows you to create a custom function based on the schema passed as an argument. The function will be used to create an instance of the `ZodAcceleratorParser` object. This makes its usage similar to Zod's.

```ts
zodSchema.parse(...)
zodAccelerateSchema.parse(...)

zodSchema.parseAsync(...)
zodAccelerateSchema.parseAsync(...)

zodSchema.safeParse(...)
zodAccelerateSchema.safeParse(...)

zodSchema.safeParseAsync(...)
zodAccelerateSchema.safeParseAsync(...)
```

### Support for Zod types
To build the custom function, we have created a converter for each type. Not all types are supported. However, to avoid compatibility issues, when a type is not supported, ZodAccelerator directly uses the Zod schema. To find out which types are supported, go to the [`scripts/accelerators`](./scripts/accelerators/) folder.

### The differences
The functions created by ZodAccelerator have some key differences compared to Zod's basic functionality :
- In case of an issue, the schema analysis does not continue, it stops immediately.
- Errors are not as explicit.
- All secondary parameters, such as custom messages, may not be implemented everywhere (can be done on request).
- The Zod contexts of `zodEffect` are not as complete.

### How custom functions are created
For each type that Zod provides, we have an algorithm that translates the information from the Zod schema into a string of code. At the end, the different relevant parts are assembled and interpreted using the `eval` function (no injection possible).

### Caching system?
Would it be possible to build the schemas in a file and then call them instead of rebuilding them? Unfortunately, no. The construction is mandatory because, in addition to the content, we also build its context (`this`). In the case of a `ZodEffect` type, for example, the associated function is stored in the context. Therefore, skipping the construction phase is not possible.

### Skipping `eval` ?
As mentioned earlier, ZodAccelerator uses the eval function to interpret the code after a Node program is launched. Currently, no other method seems viable.