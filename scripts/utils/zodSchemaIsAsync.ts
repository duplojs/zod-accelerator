import { ZodEffects, ZodObject, type ZodType, ZodArray, ZodCatch, ZodDefault, ZodIntersection, ZodLazy, ZodOptional, ZodReadonly, ZodRecord, ZodTuple, ZodUnion, ZodPipeline, ZodNullable, ZodPromise, ZodSet, ZodMap } from "zod";

export function zodSchemaIsAsync(zodSchema: unknown, lazyMap = new Set()): boolean {
	if (lazyMap.has(zodSchema)) {
		return false;
	}

	lazyMap.add(zodSchema);

	if (zodSchema instanceof ZodArray) {
		return zodSchemaIsAsync(zodSchema._def.type, lazyMap);
	} else if (zodSchema instanceof ZodCatch) {
		return zodSchemaIsAsync(zodSchema._def.innerType, lazyMap);
	} else if (zodSchema instanceof ZodDefault) {
		return zodSchemaIsAsync(zodSchema._def.innerType, lazyMap);
	} else if (zodSchema instanceof ZodEffects) {
		if (
			(
				zodSchema._def.effect.type === "transform"
				|| zodSchema._def.effect.type === "preprocess"
			)
			&& zodSchema._def.effect.transform.constructor.name === "AsyncFunction"
		) {
			return true;
		} else if (
			zodSchema._def.effect.type === "refinement"
			&& zodSchema._def.effect.refinement.constructor.name === "AsyncFunction"
		) {
			return true;
		} else if (zodSchemaIsAsync(zodSchema._def.schema, lazyMap)) {
			return true;
		} else {
			const effectFunction = zodSchema._def.effect.type === "refinement"
				? zodSchema._def.effect.refinement
				: zodSchema._def.effect.transform;

			function anyFunction() {
				return void undefined;
			}

			const impossibleErrorProxy: any = new Proxy(
				anyFunction,
				{
					get() {
						return impossibleErrorProxy;
					},
					construct() {
						anyFunction();
						return impossibleErrorProxy;
					},
					set() {
						return true;
					},
					apply() {
						return impossibleErrorProxy;
					},
				},
			);

			try {
				const result = effectFunction(
					impossibleErrorProxy,
					{
						addIssue: () => void undefined,
						path: [],
					},
				);

				if (result instanceof Promise) {
					result.catch(() => void undefined);
				}

				return result instanceof Promise;
			} catch {
				return false;
			}
		}
	} else if (
		zodSchema instanceof ZodIntersection
		&& (
			zodSchemaIsAsync(zodSchema._def.left, lazyMap)
			|| zodSchemaIsAsync(zodSchema._def.right, lazyMap)
		)
	) {
		return true;
	} else if (zodSchema instanceof ZodLazy) {
		return zodSchemaIsAsync(zodSchema._def.getter(), lazyMap);
	} else if (zodSchema instanceof ZodMap) {
		return zodSchemaIsAsync(zodSchema._def.keyType, lazyMap)
			|| zodSchemaIsAsync(zodSchema._def.valueType, lazyMap);
	} else if (zodSchema instanceof ZodNullable) {
		return zodSchemaIsAsync(zodSchema._def.innerType, lazyMap);
	} else if (zodSchema instanceof ZodObject) {
		return !Object.values(zodSchema._def.shape() as ZodType)
			.every((value) => !zodSchemaIsAsync(value, lazyMap));
	} else if (zodSchema instanceof ZodOptional) {
		return zodSchemaIsAsync(zodSchema._def.innerType, lazyMap);
	} else if (zodSchema instanceof ZodPipeline) {
		return zodSchemaIsAsync(zodSchema._def.in, lazyMap)
			|| zodSchemaIsAsync(zodSchema._def.out, lazyMap);
	} else if (zodSchema instanceof ZodPromise) {
		return true;
	} else if (zodSchema instanceof ZodReadonly) {
		return zodSchemaIsAsync(zodSchema._def.innerType, lazyMap);
	} else if (
		zodSchema instanceof ZodRecord
		&& (
			zodSchemaIsAsync(zodSchema._def.keyType, lazyMap)
			|| zodSchemaIsAsync(zodSchema._def.valueType, lazyMap)
		)
	) {
		return true;
	} else if (zodSchema instanceof ZodSet) {
		return zodSchemaIsAsync(zodSchema._def.valueType, lazyMap);
	} else if (zodSchema instanceof ZodTuple) {
		return !(zodSchema._def.items as ZodType[])
			.every((value) => !zodSchemaIsAsync(value, lazyMap))
			|| zodSchemaIsAsync(zodSchema._def.rest, lazyMap);
	} else if (zodSchema instanceof ZodUnion) {
		return !(zodSchema._def.options as ZodType[])
			.every((value) => !zodSchemaIsAsync(value, lazyMap));
	}

	return false;
}
