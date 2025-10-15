import { A, type AnyValue, createKind, E, G, innerPipe, type Kind, P, pipe, unwrap, whenElse } from "@duplojs/utils";
import { type ZodTypeUnion } from "./types";
import { getSymbolBuildedValue, hasSymbolBuilded } from "./override";
import { type Predicate } from "./types/predicate";

export namespace AccelerateValue {

	export const typeKind = createKind("accelerate-value-type");
	export type TypeKind = Kind<typeof typeKind.definition>;

	export interface Type extends TypeKind {
		readonly id: string;
		readonly lines: (string | Type)[];
		readonly contextMap: Map<AnyValue | SymbolStop, string>;
		readonly path?: string;
		readonly $input: string;
		readonly $output: string;
		readonly $in?: string;
		readonly $out?: string;
	}

	type StopContext = | { type: "return" }
		| {
			type: "break";
			id: string;
		};

	interface GetLineParameter {
		readonly $input: string;
		readonly $output: string;
		readonly $stop: string;
		fromContext(input: AnyValue, prefix?: string): string;
	}

	export const SymbolStopLabel = "SymbolStop";
	export const SymbolStop = Symbol.for(SymbolStopLabel);
	export type SymbolStop = typeof SymbolStop;

	export const create = (() => {
		let followingId = 0;

		return (stopContext: StopContext, getLines: (params: GetLineParameter) => Type["lines"]): Type => {
			const id = String(++followingId);

			let followingContextId = 0;
			const contextMap: Type["contextMap"] = new Map();
			function fromContext(value: AnyValue, prefix = "value") {
				const key = contextMap.get(value) ?? `${prefix}_${id}_${++followingContextId}`;
				contextMap.set(value, key);
				return `$context.${key}`;
			}

			const $stop = stopContext.type === "return"
				? `/** stop-return **/ return ${fromContext(SymbolStop, "stopValue")};`
				: `/** stop-break **/ break label_${stopContext.id};`;
			const $input = `$input_${id}`;
			const $output = `$output_${id}`;

			const lines = getLines({
				$input,
				$output,
				fromContext,
				$stop,
			});

			return typeKind.addTo({
				id,
				lines,
				contextMap,
				$input,
				$output,
			});
		};
	})();

	interface DefineEntryPointParams {
		$in: string;
		$out: string;
	}

	export function defineEntrypoint(type: Type, params: DefineEntryPointParams): Type {
		return {
			...type,
			...params,
		};
	}

	export interface AcceleratorParams {
		make(zodSchema: ZodTypeUnion, stopContext?: StopContext): Type;
		create(getLines: Parameters<typeof create>[1]): Type;
	}

	export type Maker = (zodSchema: ZodTypeUnion, params: AcceleratorParams) => E.Optional<Type>;

	export function createMaker<
		GenericPredicate extends ZodTypeUnion = ZodTypeUnion,
	>(
		predicate: | ((zodSchema: ZodTypeUnion) => zodSchema is GenericPredicate)
			| ((zodSchema: ZodTypeUnion) => boolean),
		theFunction: (zodSchema: GenericPredicate, params: AcceleratorParams) => Type,
	): Maker {
		return (zodSchema, params) => whenElse(
			zodSchema,
			predicate,
			innerPipe(
				(value) => theFunction(value as GenericPredicate, params),
				E.optional,
			),
			E.optionalEmpty,
		);
	}

	function defaultType(zodSchema: ZodTypeUnion, stopContext: StopContext): Type {
		return create(
			stopContext,
			({ $input, fromContext, $stop }) => [
				`
				${$input} = ${fromContext(zodSchema)}.safeParse(${$input});

				if(${$input}.success === false) {
					${$stop}
				}
				`,
			],
		);
	}

	function alreadyHaveBuild(
		zodSchema: Predicate<typeof hasSymbolBuilded>,
		stopContext: StopContext,
	): Type {
		function launchBuildedSchema(data: unknown) {
			const buildedContext = getSymbolBuildedValue(zodSchema);

			return buildedContext?.buildedSchema(
				data,
				buildedContext.context,
			);
		}

		return create(
			stopContext,
			({ $input, fromContext, $stop }) => [
				`
				${$input} = ${fromContext(launchBuildedSchema)}(${$input})

				if(${$input} === ${fromContext(SymbolStop)}) {
					${$stop}
				}
				`,
			],
		);
	}

	export function make(
		zodSchema: ZodTypeUnion,
		accelerators: Maker[],
		stopContext: StopContext,
	): Type {
		if (hasSymbolBuilded(zodSchema)) {
			return alreadyHaveBuild(zodSchema, stopContext);
		}

		return pipe(
			accelerators,
			A.reduce(
				A.reduceFrom<E.Optional<Type>>(E.optionalEmpty()),
				({ element: accelerator, exit, next }) => whenElse(
					accelerator(zodSchema, {
						make: (subZodSchema, subStopContext) => make(
							subZodSchema,
							accelerators,
							subStopContext ?? stopContext,
						),
						create: (getLines) => create(stopContext, getLines),
					}),
					E.isOptionalFilled,
					exit,
					next,
				),
			),
			E.whenIsOptionalEmpty(
				() => defaultType(zodSchema, stopContext),
			),
			E.whenIsOptionalFilled(
				unwrap,
			),
		);
	}

	export const flatTypeKind = createKind("accelerate-value-flat-type");
	export type FlatTypeKind = Kind<typeof flatTypeKind.definition>;

	export interface FlatType extends FlatTypeKind {
		lines: string[];
		context: Record<string, AnyValue | SymbolStop>;
	}

	export function flat(accelerateValue: Type): FlatType {
		const initialContext = G.reduce(
			accelerateValue.contextMap,
			G.reduceFrom<FlatType["context"]>({}),
			({ element: [value, key], lastValue, nextWithObject }) => nextWithObject(
				lastValue,
				{ [key]: value },
			),
		);

		return pipe(
			accelerateValue.lines,
			A.reduce(
				A.reduceFrom<Omit<FlatType, keyof FlatTypeKind>>({
					lines: [],
					context: initialContext,
				}),
				({ element, lastValue, next, nextWithObject }) => pipe(
					element,
					P.when(
						typeKind.has,
						(childAccelerateValue) => {
							const flatChildAccelerateValue = flat(childAccelerateValue);

							return next({
								lines: A.push(
									lastValue.lines,
									"{",
									childAccelerateValue.$in
										? `let ${childAccelerateValue.$input} = ${childAccelerateValue.$in};`
										: `let ${childAccelerateValue.$input};`,
									`let ${childAccelerateValue.$output};`,
									...flatChildAccelerateValue.lines,
									`${childAccelerateValue.$output} = ${childAccelerateValue.$input};`,
									childAccelerateValue.$out
										? `${childAccelerateValue.$out} = ${childAccelerateValue.$output};`
										: "",
									"}",
								),
								context: {
									...lastValue.context,
									...flatChildAccelerateValue.context,
								},
							});
						},
					),
					P.otherwise(
						(stringLine) => nextWithObject(
							lastValue,
							{ lines: A.push(lastValue.lines, stringLine) },
						),
					),
				),
			),
			flatTypeKind.addTo,
		);
	}
}
