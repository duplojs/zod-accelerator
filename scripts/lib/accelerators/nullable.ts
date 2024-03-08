import * as zod from "zod";
import {ZodAccelerator} from "../accelerator";
import {ZodAcceleratorContent} from "../content";

export class ZodNullableAccelerator extends ZodAccelerator{
	public get support(){
		return zod.ZodNullable;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodNullable<any>, zac: ZodAcceleratorContent){
		const def = zodSchema._def;
		const zacInnerType = ZodAccelerator.findAcceleratorContent(def.innerType);

		zac.addContent(
			"if($input !== null){",
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
		new ZodNullableAccelerator();
	}
}
