import type * as zod from "zod";
import { ZodAccelerator } from "../accelerator";
import type { ZodAcceleratorContent } from "../content";

@ZodAccelerator.autoInstance
export class ZodNullAccelerator extends ZodAccelerator {
	public get support() {
		return ZodAccelerator.zod.ZodNull;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodNull, zac: ZodAcceleratorContent) {
		zac.addContent(
			ZodNullAccelerator.contentPart.typeof(),
		);

		return zac;
	}

	public static contentPart = {
		typeof: () => ({
			if: /* js */"$input !== null",
			message: "Input is not null.",
		}),
	};
}
