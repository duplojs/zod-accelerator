import * as zod from "zod";
import {ZodAccelerator} from "../accelerator";
import {ZodAcceleratorContent} from "../content";

export class ZodDefaultAccelerator extends ZodAccelerator{
	public get support(){
		return zod.ZodDefault;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodDefault<zod.ZodAny>, zac: ZodAcceleratorContent){
		const def = zodSchema._def;
		const zacInnerType = ZodAccelerator.findAcceleratorContent(def.innerType);
        
		zac.addContext({
			defaultValue: def.defaultValue
		});

		zac.addContent(
			ZodDefaultAccelerator.contentPart.default(),
			"else {",
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
		default: () => /* js */`
            if($input === undefined){
                $input = $this.defaultValue()
            }
        `
	};

	static {
		new ZodDefaultAccelerator();
	}
}
