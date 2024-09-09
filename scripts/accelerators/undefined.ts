import type * as zod from "zod";
import { ZodAccelerator } from "../accelerator";
import type { ZodAcceleratorContent } from "../content";

@ZodAccelerator.autoInstance
export class ZodUndefinedAccelerator extends ZodAccelerator {
	public get support() {
		return ZodAccelerator.zod.ZodUndefined;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodUndefined, zac: ZodAcceleratorContent) {
		zac.addContent(
			ZodUndefinedAccelerator.contentPart.typeof(),
		);

		return zac;
	}

	public static contentPart = {
		typeof: () => ({
			if: /* js */"(typeof $input !== \"undefined\")",
			message: "Input is not Undefined.",
		}),
	};
}
