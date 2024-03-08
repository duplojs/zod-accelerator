import * as zod from "zod";
import {ZodAccelerator} from "../accelerator";
import {ZodAcceleratorContent} from "../content";

export class ZodLiteralAccelerator extends ZodAccelerator{
	public get support(){
		return zod.ZodLiteral;
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
			message: ""
		})
	};

	static {
		new ZodLiteralAccelerator();
	}
}
