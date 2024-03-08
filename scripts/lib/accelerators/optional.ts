import * as zod from "zod";
import {ZodAccelerator} from "../accelerator";
import {ZodAcceleratorContent} from "../content";

export class ZodOptionalAccelerator extends ZodAccelerator{
	public get support(){
		return zod.ZodOptional;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodOptional<zod.ZodAny>, zac: ZodAcceleratorContent){
		const def = zodSchema._def;
		const zacInnerType = ZodAccelerator.findAcceleratorContent(def.innerType);

		zac.addContent(
			"if($input !== undefined){",
			[
				zacInnerType,
				{
					path: null,
					input: "$input",
					output: "$input",
				}
			],
			"}"
		);

		return zac;
	}

	static contentPart = {
        
	};

	static {
		new ZodOptionalAccelerator();
	}
}
