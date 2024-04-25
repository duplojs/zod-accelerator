import * as zod from "zod";
import {ZodAccelerator} from "../accelerator";
import {ZodAcceleratorContent} from "../content";

@ZodAccelerator.autoInstance
export class ZodLiteralAccelerator extends ZodAccelerator{
	public get support(){
		return ZodAccelerator.zod.ZodLiteral;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodLiteral<any>, zac: ZodAcceleratorContent){
		const def = zodSchema._def;

		zac.addContext({
			value: def.value,
		});

		zac.addContent(
			ZodLiteralAccelerator.contentPart.typeof()
		);

		return zac;
	}

	static contentPart = {
		typeof: () => ({
			if: /* js */"$input !== $this.value",
			message: "Input literal is wrong."
		})
	};
}
