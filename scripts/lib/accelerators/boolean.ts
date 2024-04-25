import * as zod from "zod";
import {ZodAccelerator} from "../accelerator";
import {ZodAcceleratorContent} from "../content";

@ZodAccelerator.autoInstance
export class ZodBooleanAccelerator extends ZodAccelerator{
	public get support(){
		return ZodAccelerator.zod.ZodBoolean;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodBoolean, zac: ZodAcceleratorContent){
		const def = zodSchema._def;

		zac.addContent(
			def.coerce 
				? ZodBooleanAccelerator.contentPart.coerce()
				: ZodBooleanAccelerator.contentPart.typeof()
		);

		return zac;
	}

	static contentPart = {
		coerce: () => /* js */`
            $input = Boolean($input).valueOf();
        `,
		typeof: () => ({
			if: /* js */"(typeof $input !== \"boolean\")",
			message: "Input is not boolean.",
		}),
	};
}
