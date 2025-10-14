import { A, type AnyValue, createKind, E, G, innerPipe, type Kind, P, pipe, unwrap } from "@duplojs/utils";
import { type ZodTypeUnion } from "./types";
import { getZodError } from "./getZodError";

export namespace AccelerateValue {

	export const typeKind = createKind("accelerate-value-type");
	export type TypeKind = Kind<typeof typeKind.definition>;

	export interface Type extends TypeKind {
		id: string;
		lines: (string | Type)[];
		contextMap: Map<AnyValue | Stop, string>;
		path?: string;
		$input: string;
		$output: string;
		$in?: string;
		$out?: string;
	}

	interface GetLineParameter {
		readonly $input: string;
		readonly $output: string;
		stop(errorMessage: string): string;
		fromContext(input: AnyValue, prefix?: string): string;
	}

	export const stopKind = createKind("accelerate-stop");
	export type StopKind = Kind<typeof stopKind.definition>;

	interface Stop extends StopKind {
		path: string;
		message: string;
	}

	export const create = (() => {
		let followingId = 0;

		return (path: string, getLines: (params: GetLineParameter) => Type["lines"]): Type => {
			const id = String(++followingId);

			let followingContextId = 0;
			const contextMap: Type["contextMap"] = new Map();
			function fromContext(value: AnyValue, prefix = "value") {
				const key = contextMap.get(value) ?? `${prefix}_${id}_${++followingContextId}`;
				contextMap.set(value, key);
				return `$context.${key}`;
			}

			function stop(message: string) {
				const contextStringRef = fromContext(
					stopKind.addTo({
						path,
						message,
					}),
					"stopValue",
				);

				return `/** stop **/ return ${contextStringRef};`;
			}

			const $input = `$input_${id}`;
			const $output = `$output_${id}`;

			const lines = getLines({
				$input,
				$output,
				fromContext,
				stop,
			});

			return typeKind.addTo({
				id,
				lines,
				path,
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
		find(zodSchema: ZodTypeUnion, path?: string): Type;
		create(getLines: Parameters<typeof create>[1]): Type;
		path: string;
	}

	export type Accelerator = (zodSchema: ZodTypeUnion, params: AcceleratorParams) => E.Optional<Type>;

	export function createAccelerator<
		GenericPredicate extends ZodTypeUnion = ZodTypeUnion,
	>(
		predicate: | ((zodSchema: ZodTypeUnion) => zodSchema is GenericPredicate)
			| ((zodSchema: ZodTypeUnion) => boolean),
		theFunction: (zodSchema: GenericPredicate, params: AcceleratorParams) => Type,
	): Accelerator {
		return (zodSchema, params) => pipe(
			zodSchema,
			P.when(
				predicate,
				innerPipe(
					(value: GenericPredicate) => theFunction(value, params),
					E.optional,
				),
			),
			P.otherwise(E.optionalEmpty),
		);
	}

	function defaultAccelerator(zodSchema: ZodTypeUnion, path: string): Type {
		return create(
			path,
			({ $input, $output, fromContext, stop }) => [
				`
				const result = ${fromContext(zodSchema)}.safeParse(${$input});

				if(result.success === false) {
					${stop(getZodError(zodSchema, ""))}
				}

				${$output} = result.data;
				`,
			],
		);
	}

	export function find(
		zodSchema: ZodTypeUnion,
		accelerators: Accelerator[],
		path: string,
	): Type {
		return pipe(
			accelerators,
			A.reduce(
				A.reduceFrom<E.Optional<Type>>(E.optionalEmpty()),
				({ element: accelerator, exit, next }) => pipe(
					accelerator(zodSchema, {
						find: (subZodSchema, subPath) => find(
							subZodSchema,
							accelerators,
							subPath ? `${path}.${subPath}` : path,
						),
						create: (getLines) => create(path, getLines),
						path,
					}),
					P.when(
						E.isOptionalFilled,
						exit,
					),
					P.when(
						E.isOptionalEmpty,
						next,
					),
					P.exhaustive,
				),
			),
			E.whenIsOptionalEmpty(
				() => defaultAccelerator(zodSchema, path),
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
		context: Record<string, AnyValue | Stop>;
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
