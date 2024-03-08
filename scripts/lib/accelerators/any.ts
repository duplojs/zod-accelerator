import * as zod from "zod";
import {ZodAccelerator} from "../accelerator";
import {ZodAcceleratorContent} from "../content";

export class ZodAnyAccelerator extends ZodAccelerator{
	public get support(){
		return zod.ZodAny;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodAny, zac: ZodAcceleratorContent){
		return zac;
	}

	static contentPart = {

	};

	static {
		new ZodAnyAccelerator();
	}
}
