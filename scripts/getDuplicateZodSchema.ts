import { A, G, innerPipe } from "@duplojs/utils";
import { type ZodTypeUnion } from "./types";
import { countEachZodSchema } from "./countEachZodSchema";

export const getDuplicateZodSchema = innerPipe(
	(zodType: ZodTypeUnion) => countEachZodSchema(
		zodType,
		new Map(),
	),
	G.filter((entry) => entry[1] > 1),
	G.map(A.first),
	A.from,
);
