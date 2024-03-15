import * as zod from "zod";
import {ZodAccelerator} from "../accelerator";
import {ZodAcceleratorContent} from "../content";

@ZodAccelerator.autoInstance
export class ZodUndefinedAccelerator extends ZodAccelerator{
	public get support(){
		return zod.ZodUndefined;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodUndefined, zac: ZodAcceleratorContent){
		const def = zodSchema._def;

		zac.addContent(
			ZodUndefinedAccelerator.contentPart.typeof()
		);

		return zac;
	}

	static contentPart = {
		typeof: () => ({
			if: /* js */"(typeof $input !== \"undefined\")",
			message: "Input is not Undefined."
		})
	};
}
