import type * as zod from "zod";
import { ZodAccelerator } from "../accelerator";

@ZodAccelerator.autoInstance
export class ZodLazyAccelerator extends ZodAccelerator {
	public get support() {
		return ZodAccelerator.zod.ZodLazy;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodLazy<zod.ZodType>) {
		const def = zodSchema._def;

		const zac = ZodAccelerator.findAcceleratorContent(def.getter());

		return zac;
	}

	public static contentPart = {

	};
}
