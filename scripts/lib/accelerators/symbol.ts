import * as zod from "zod";
import {ZodAccelerator} from "../accelerator";
import {ZodAcceleratorContent} from "../content";

@ZodAccelerator.autoInstance
export class ZodSymbolAccelerator extends ZodAccelerator{
	public get support(){
		return ZodAccelerator.zod.ZodSymbol;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodSymbol, zac: ZodAcceleratorContent){
		zac.addContent(
			ZodSymbolAccelerator.contentPart.typeof()
		);

		return zac;
	}

	static contentPart = {
		typeof: () => ({
			if: /* js */"(typeof $input !== \"symbol\")",
			message: "Input is not a Symbol."
		})
	};
}
