import type * as zod from "zod";
import { ZodAccelerator } from "../accelerator";
import type { ZodAcceleratorContent } from "../content";

@ZodAccelerator.autoInstance
export class ZodNullableAccelerator extends ZodAccelerator {
	public get support() {
		return ZodAccelerator.zod.ZodNullable;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodNullable<zod.ZodType>, zac: ZodAcceleratorContent) {
		const def = zodSchema._def;
		const zacInnerType = ZodAccelerator.findAcceleratorContent(def.innerType);

		zac.addContent(
			"if($input !== null){",
			[
				zacInnerType,
				{
					path: null,
					input: "$input",
					output: "$input",
				},
			],
			"}",
		);

		return zac;
	}

	public static contentPart = {

	};
}
