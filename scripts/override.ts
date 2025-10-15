import { type z as zod, type core, type ZodType } from "zod";

export const SymbolBuildedFunctionLabel = "SymbolBuildedFunction";
const SymbolBuildedFunction = Symbol.for(SymbolBuildedFunctionLabel);
type SymbolBuildedFunction = typeof SymbolBuildedFunction;

export function setSymbolBuildedValue(
	zodSchema: ZodType,
	value: Builded | undefined,
) {
	zodSchema[SymbolBuildedFunction] = value;
}

export function hasSymbolBuilded<
	GenericZodType extends ZodType,
>(
	zodSchema: GenericZodType,
): zodSchema is (
	& GenericZodType
	& {
		[SymbolBuildedFunction]: GenericZodType[SymbolBuildedFunction];
	}
) {
	return SymbolBuildedFunction in zodSchema;
}

export function getSymbolBuildedValue<
	GenericZodType extends ZodType,
>(
	zodSchema: GenericZodType,
): Builded<zod.output<ZodType>> | undefined {
	return zodSchema[SymbolBuildedFunction];
}

export interface Builded<
	GenericOutput extends unknown = unknown,
> {
	buildedSchema(data: unknown, context: Record<string, any>): GenericOutput;
	context: Record<string, any>;
}

declare module "zod" {
	interface ZodType<
		out Output = unknown,
		out Input = unknown,
		out Internals extends core.$ZodTypeInternals<Output, Input> = core.$ZodTypeInternals<Output, Input>,
	> {
		[SymbolBuildedFunction]?: Builded<Output>;
	}
}
