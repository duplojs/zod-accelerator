import { A, innerPipe, N, O, P, pipe, isType, type ExpectType } from "@duplojs/utils";
import { type ZodTypeUnion } from "./types";
import { type ZodType } from "zod";

export function countEachZodSchema(
	zodSchema: ZodTypeUnion,
	box: Map<ZodTypeUnion, number>,
): Map<ZodTypeUnion, number> {
	box.set(
		zodSchema,
		N.add(
			box.get(zodSchema) ?? 0,
			1,
		),
	);

	const quantity = box.get(zodSchema) ?? 0;

	if (quantity > 1) {
		return box;
	}

	return pipe(
		zodSchema,
		innerPipe(
			P.when(
				O.discriminate("type", [
					"any",
					"string",
					"number",
					"date",
					"bigint",
					"file",
					"function",
					"void",
					"undefined",
					"unknown",
					"enum",
					"file",
					"boolean",
					"nan",
					"literal",
					"symbol",
					"never",
					"null",
					"custom",
					"transform",
				]),
				() => box,
			),
			P.when(
				O.discriminate("type", [
					"catch",
					"optional",
					"prefault",
					"default",
					"nonoptional",
					"success",
					"promise",
					"nullable",
					"readonly",
				]),
				(value) => countEachZodSchema(
					value.def.innerType as ZodTypeUnion,
					box,
				),
			),
			P.when(
				O.discriminate("type", "array"),
				(value) => countEachZodSchema(
					value.element as ZodTypeUnion,
					box,
				),
			),
			P.when(
				O.discriminate("type", "object"),
				(value) => pipe(
					value.shape,
					O.values,
					A.map(
						(value) => countEachZodSchema(
							value as ZodTypeUnion,
							box,
						),
					),
					() => box,
				),
			),
			P.when(
				O.discriminate("type", "tuple"),
				(value) => pipe(
					[...value.def.items, value.def.rest],
					A.map(
						(zodSchema) => zodSchema && countEachZodSchema(
							zodSchema as ZodTypeUnion,
							box,
						),
					),
					() => box,
				),
			),
			P.when(
				O.discriminate("type", "record"),
				(value) => pipe(
					[value.def.keyType, value.def.valueType],
					A.map(
						(zodSchema) => zodSchema && countEachZodSchema(
							zodSchema as ZodTypeUnion,
							box,
						),
					),
					() => box,
				),
			),
			P.when(
				O.discriminate("type", "union"),
				(value) => pipe(
					value.def.options,
					A.map(
						(zodSchema) => countEachZodSchema(
							zodSchema as ZodTypeUnion,
							box,
						),
					),
					() => box,
				),
			),
			P.when(
				O.discriminate("type", "intersection"),
				(value) => pipe(
					[value.def.left, value.def.right],
					A.map(
						(zodSchema) => countEachZodSchema(
							zodSchema as ZodTypeUnion,
							box,
						),
					),
					() => box,
				),
			),
			P.when(
				O.discriminate("type", "map"),
				(value) => pipe(
					[value.def.valueType, value.def.keyType],
					A.map(
						(zodSchema) => countEachZodSchema(
							zodSchema as ZodTypeUnion,
							box,
						),
					),
					() => box,
				),
			),
			P.when(
				O.discriminate("type", "lazy"),
				(value) => countEachZodSchema(
					value.def.getter() as ZodTypeUnion,
					box,
				),
			),
		),
		innerPipe(
			P.when(
				O.discriminate("type", "set"),
				(value) => countEachZodSchema(
					value.def.valueType as ZodTypeUnion,
					box,
				),
			),
			P.when(
				O.discriminate("type", "pipe"),
				(value) => pipe(
					[value.def.in, value.def.out],
					A.map(
						(zodSchema) => countEachZodSchema(
							zodSchema as ZodTypeUnion,
							box,
						),
					),
					() => box,
				),
			),
			P.when(
				O.discriminate("type", "template_literal"),
				(value) => pipe(
					value.def.parts,
					A.filter(isType("object")),
					A.map(
						(zodSchema) => countEachZodSchema(
							zodSchema as ZodTypeUnion,
							box,
						),
					),
					() => box,
				),
			),
		),
		P.otherwise(
			(_zodType) => {
				type _Check = ExpectType<
					typeof _zodType,
					ZodType,
					"strict"
				>;

				return box;
			},
		),
	);
}
