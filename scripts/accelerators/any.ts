import type * as zod from "zod";
import { ZodAccelerator } from "../accelerator";
import type { ZodAcceleratorContent } from "../content";

@ZodAccelerator.autoInstance
export class ZodAnyAccelerator extends ZodAccelerator {
	public get support() {
		return ZodAccelerator.zod.ZodAny;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodAny, zac: ZodAcceleratorContent) {
		return zac;
	}

	public static contentPart = {

	};
}
