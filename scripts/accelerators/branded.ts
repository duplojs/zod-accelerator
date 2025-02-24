import { type ZodType, type ZodBranded } from "zod";
import { ZodAccelerator } from "../accelerator";
import { type ZodAcceleratorContent } from "@scripts/content";

@ZodAccelerator.autoInstance
export class ZodNullableAccelerator extends ZodAccelerator {
	public get support() {
		return ZodAccelerator.zod.ZodBranded;
	}

	public makeAcceleratorContent(zodSchema: ZodBranded<ZodType, any>, zac: ZodAcceleratorContent) {
		const def = zodSchema._def;
		const zacInnerType = ZodAccelerator.findAcceleratorContent(def.type);

		zac.addContent(
			[
				zacInnerType,
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
