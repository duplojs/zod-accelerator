import type * as zod from "zod";
import { ZodAccelerator } from "../accelerator";
import { ZodArrayAccelerator } from "./array";
import type { ZodAcceleratorContent } from "../content";

@ZodAccelerator.autoInstance
export class ZodTupleAccelerator extends ZodAccelerator {
	public get support() {
		return ZodAccelerator.zod.ZodTuple;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodTuple, zac: ZodAcceleratorContent) {
		const def = zodSchema._def;

		zac.addContent(
			"let $output = [];",
			ZodTupleAccelerator.contentPart.typeof(),
			def.rest
				? ZodTupleAccelerator.contentPart.min({ value: def.items.length })
				: ZodTupleAccelerator.contentPart.exact({ value: def.items.length }),
		);

		def.items.forEach((value, index) => {
			zac.addContent(
				[
					ZodAccelerator.findAcceleratorContent(value as zod.ZodType),
					{
						path: `[Tuple ${index}]`,
						input: `$input[${index}]`,
						output: `$output[${index}]`,
					},
				],
			);
		});

		if (def.rest) {
			zac.addContent(
				`for(let $id_index = ${def.items.length}; $id_index < $input.length; $id_index++){`,
				[
					ZodAccelerator.findAcceleratorContent(def.rest),
					{
						path: "[Tuple Rest ${$id_index}]",
						input: "$input[$id_index]",
						output: "$output[$id_index]",
					},
				],
				"}",
			);
		}

		zac.addContent(
			"$input = $output",
		);

		return zac;
	}

	public static contentPart = {
		...ZodArrayAccelerator.contentPart,
	};
}
