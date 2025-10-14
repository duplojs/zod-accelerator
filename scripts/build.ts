import { type ZodType } from "zod";
import { getDuplicateZodSchema } from "./getDuplicateZodSchema";
import { A, type AnyFunction, pipe } from "@duplojs/utils";
import { setSymbolBuildedValue } from "./override";
import { AccelerateValue } from "./accelerateValue";

export function build<
	GenericInnerType extends unknown,
>(
	zodSchema: ZodType<GenericInnerType>,
	accelerator: AccelerateValue.Accelerator[],
) {
	void pipe(
		zodSchema,
		getDuplicateZodSchema,
		A.map((zodSchema) => {
			setSymbolBuildedValue(zodSchema, undefined);

			return zodSchema;
		}),
	);

	return pipe(
		AccelerateValue.find(zodSchema, accelerator, ""),
		(type) => AccelerateValue.create(
			"",
			() => [
				"let $output;",
				AccelerateValue.defineEntrypoint(type, {
					$in: "$input",
					$out: "$output",
				}),
			],
		),
		AccelerateValue.flat,
		({ lines, context }) => ({
			buildedSchema: eval(`
			($input, $context) => {

				${lines.join("\n")}

				return $output
			}
			`) as AnyFunction,
			context: context,
		}),
	);
}
