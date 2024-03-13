import * as zod from "zod";
import {ZodAccelerator} from "../accelerator";
import {ZodAcceleratorContent} from "../content";

export class ZodNullAccelerator extends ZodAccelerator{
	public get support(){
		return zod.ZodNull;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodNull, zac: ZodAcceleratorContent){
		zac.addContent(
			ZodNullAccelerator.contentPart.typeof()
		);

		return zac;
	}

	static contentPart = {
		typeof: () => ({
			if: /* js */"$input !== null",
			message: "Input is not null."
		})
	};

	static {
		new ZodNullAccelerator();
	}
}
