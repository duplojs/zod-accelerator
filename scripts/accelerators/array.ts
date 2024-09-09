import type * as zod from "zod";
import { ZodAccelerator } from "../accelerator";
import type { ZodAcceleratorContent } from "../content";

@ZodAccelerator.autoInstance
export class ZodArrayAccelerator extends ZodAccelerator {
	public get support() {
		return ZodAccelerator.zod.ZodArray;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodArray<zod.ZodType>, zac: ZodAcceleratorContent) {
		const def = zodSchema._def;

		const zacType = ZodAccelerator.findAcceleratorContent(def.type);
		zac.addContent(
			"let $output = [];",
			ZodArrayAccelerator.contentPart.typeof(),
			def.minLength ? ZodArrayAccelerator.contentPart.min(def.minLength) : null,
			def.maxLength ? ZodArrayAccelerator.contentPart.max(def.maxLength) : null,
			def.exactLength ? ZodArrayAccelerator.contentPart.exact(def.exactLength) : null,
			"for(let index = 0; index < $input.length; index++){",
			[
				zacType,
				{
					path: "[Array ${index}]",
					input: "$input[index]",
					output: "$output[index]",
				},
			],
			"}",
			"$input = $output",
		);

		return zac;
	}

	public static contentPart = {
		typeof: () => ({
			if: /* js */"!($input instanceof Array)",
			message: "Input is not Array.",
		}),
		min: ({ value }: { value: number }) => ({
			if: /* js */`$input.length < ${value}`,
			message: `Input Array has length less than ${value}.`,
		}),
		max: ({ value }: { value: number }) => ({
			if: /* js */`$input.length > ${value}`,
			message: `Input Array has length more than ${value}.`,
		}),
		exact: ({ value }: { value: number }) => ({
			if: /* js */`$input.length !== ${value}`,
			message: `Input Array has length not equal to ${value}.`,
		}),
	};
}
