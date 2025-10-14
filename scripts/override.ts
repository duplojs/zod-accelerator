import { type AnyFunction } from "@duplojs/utils";
import { type ZodType } from "zod";
import { type $ZodTypeInternals } from "zod/v4/core";

export const SymbolBuildedFunctionLabel = "SymbolBuildedFunction";
const SymbolBuildedFunction = Symbol.for(SymbolBuildedFunctionLabel);
type SymbolBuildedFunction = typeof SymbolBuildedFunction;

export function setSymbolBuildedValue(
	zodSchema: ZodType,
	value: AnyFunction | undefined,
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

declare module "zod" {
	interface ZodType<
		out Output = unknown,
		out Input = unknown,
		out Internals extends $ZodTypeInternals<Output, Input> = $ZodTypeInternals<Output, Input>,
	> {
		[SymbolBuildedFunction]?(): Output;
	}
}
