import type * as zod from "zod";
import { ZodAccelerator } from "../accelerator";
import type { ZodAcceleratorContent } from "../content";

@ZodAccelerator.autoInstance
export class ZodNeverAccelerator extends ZodAccelerator {
	public get support() {
		return ZodAccelerator.zod.ZodNever;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodNever, zac: ZodAcceleratorContent) {
		zac.addContent(
			ZodNeverAccelerator.contentPart.typeof(),
		);
		return zac;
	}

	public static contentPart = {
		typeof: () => ({
			if: /* js */"true",
			message: "Input is not never.",
		}),
	};
}
