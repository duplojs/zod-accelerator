import type * as zod from "zod";
import { ZodAccelerator } from "../accelerator";
import type { ZodAcceleratorContent } from "../content";

@ZodAccelerator.autoInstance
export class ZodNanAccelerator extends ZodAccelerator {
	public get support() {
		return ZodAccelerator.zod.ZodNaN;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodNaN, zac: ZodAcceleratorContent) {
		zac.addContent(
			ZodNanAccelerator.contentPart.typeof(),
		);

		return zac;
	}

	public static contentPart = {
		typeof: () => ({
			if: /* js */"!isNaN($input)",
			message: "Input is not NaN.",
		}),
	};
}
