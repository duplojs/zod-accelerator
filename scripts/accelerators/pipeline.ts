import type * as zod from "zod";
import { ZodAccelerator } from "../accelerator";
import type { ZodAcceleratorContent } from "../content";

@ZodAccelerator.autoInstance
export class ZodPipelineAccelerator extends ZodAccelerator {
	public get support() {
		return ZodAccelerator.zod.ZodPipeline;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodPipeline<zod.ZodType, zod.ZodType>, zac: ZodAcceleratorContent) {
		const def = zodSchema._def;
		const zacIn = ZodAccelerator.findAcceleratorContent(def.in);
		const zacOut = ZodAccelerator.findAcceleratorContent(def.out);

		zac.addContent(
			[
				zacIn,
				{
					path: null,
					input: "$input",
					output: "$input",
				},
			],
			[
				zacOut,
				{
					path: null,
					input: "$input",
					output: "$input",
				},
			],
		);

		return zac;
	}

	public static contentPart = {

	};
}
