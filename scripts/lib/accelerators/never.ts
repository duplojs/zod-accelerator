import * as zod from "zod";
import {ZodAccelerator} from "../accelerator";
import {ZodAcceleratorContent} from "../content";

@ZodAccelerator.autoInstance
export class ZodNeverAccelerator extends ZodAccelerator{
	public get support(){
		return zod.ZodNever;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodNever, zac: ZodAcceleratorContent){
		zac.addContent(
			ZodNeverAccelerator.contentPart.typeof()
		);
		return zac;
	}

	static contentPart = {
		typeof: () => ({
			if: /* js */"true",
			message: "Input is not never."
		})
	};
}
