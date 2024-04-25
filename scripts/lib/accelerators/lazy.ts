import * as zod from "zod";
import {ZodAccelerator} from "../accelerator";
import {ZodAcceleratorContent} from "../content";

@ZodAccelerator.autoInstance
export class ZodLazyAccelerator extends ZodAccelerator{
	public get support(){
		return ZodAccelerator.zod.ZodLazy;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodLazy<zod.ZodType>){
		const def = zodSchema._def;

		const zac = ZodAccelerator.findAcceleratorContent(def.getter());

		return zac;
	}

	static contentPart = {

	};
}
