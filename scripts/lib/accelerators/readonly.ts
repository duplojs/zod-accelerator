import * as zod from "zod";
import {ZodAccelerator} from "../accelerator";
import {ZodAcceleratorContent} from "../content";

export class ZodReadonlyAccelerator extends ZodAccelerator{
	public get support(){
		return zod.ZodReadonly;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodReadonly<any>, zac: ZodAcceleratorContent){
		const def = zodSchema._def;
		const zacInnerType = ZodAccelerator.findAcceleratorContent(def.innerType);
        
		zac.addContent(
			[
				zacInnerType,
				{
					path: null,
					input: "$input",
					output: "$input",
				}
			],
			/* js */"$input = Object.freeze($input);"
		);

		return zac;
	}

	static contentPart = {
        
	};

	static {
		new ZodReadonlyAccelerator();
	}
}
