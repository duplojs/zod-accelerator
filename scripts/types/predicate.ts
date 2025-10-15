export type Predicate<
	GenericFunction extends (input: any, ...args: any[]) => input is any,
> = GenericFunction extends (input: any, ...args: any[]) => input is infer InferredPredicate
	? InferredPredicate
	: never;
