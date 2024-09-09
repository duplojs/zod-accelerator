import type * as zod from "zod";
import { ZodAccelerator } from "../accelerator";
import type { ZodAcceleratorContent } from "../content";

@ZodAccelerator.autoInstance
export class ZodReadonlyAccelerator extends ZodAccelerator {
	public get support() {
		return ZodAccelerator.zod.ZodReadonly;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodReadonly<zod.ZodType>, zac: ZodAcceleratorContent) {
		const def = zodSchema._def;
		const zacInnerType = ZodAccelerator.findAcceleratorContent(def.innerType);

		zac.addContent(
			[
				zacInnerType,
				{
					path: null,
					input: "$input",
					output: "$input",
				},
			],
			/* js */"$input = Object.freeze($input);",
		);

		return zac;
	}

	public static contentPart = {

	};
}
