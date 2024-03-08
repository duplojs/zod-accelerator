import * as zod from "zod";
import {ZodAccelerator} from "../accelerator";
import {ZodAcceleratorContent} from "../content";

export class ZodNanAccelerator extends ZodAccelerator{
	public get support(){
		return zod.ZodNaN;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodNaN, zac: ZodAcceleratorContent){
		zac.addContent(
			ZodNanAccelerator.contentPart.typeof()
		);

		return zac;
	}

	static contentPart = {
		typeof: () => ({
			if: /* js */"!isNaN($input)",
			message: ""
		})
	};

	static {
		new ZodNanAccelerator();
	}
}
