import * as zod from "zod";
import {ZodAccelerator} from "../accelerator";
import {ZodAcceleratorContent} from "../content";

export class ZodEnumAccelerator extends ZodAccelerator{
	public get support(){
		return zod.ZodEnum;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodEnum<[string]>, zac: ZodAcceleratorContent){
		const def = zodSchema._def;

		zac.addContext({
			enumValues: def.values
		});

		zac.addContent(
			ZodEnumAccelerator.contentPart.enum()
		);

		return zac;
	}

	static contentPart = {
		enum: () => ({
			if: /* js */"!$this.enumValues.includes($input)",
			message: ""
		})
	};

	static {
		new ZodEnumAccelerator();
	}
}
