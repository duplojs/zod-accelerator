export type Predicate<
	GenericFunction extends (input: any) => input is any,
> = GenericFunction extends (input: any) => input is infer InferredPredicate
	? InferredPredicate
	: never;
