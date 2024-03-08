import * as zod from "zod";
import {ZodAccelerator} from "../accelerator";
import {ZodAcceleratorContent} from "../content";

export class ZodObjectAccelerator extends ZodAccelerator{
	public get support(){
		return zod.ZodObject;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodObject<Record<keyof any, any>>, zac: ZodAcceleratorContent){
		const def = zodSchema._def;
		const shape = def.shape();
        
		zac.addContext({
			shape: Object.keys(shape).reduce<Record<string, true>>(
				(pv, cv) => {
					pv[cv] = true;
					return pv;
				},
				{}
			)
		});

		zac.addContent(
			"let $output = {};",
			ZodObjectAccelerator.contentPart.typeof()
		);

		Object.entries(shape).forEach(([key, zodSchema]) => {
			const propsZac = ZodAccelerator.findAcceleratorContent(zodSchema);
			zac.addContent(
				[
					propsZac, 
					{
						path: key,
						input: `$input["${key}"]`,
						output: `$output["${key}"]`,
					}
				],
				/* js */`
                    if($output["${key}"] === undefined){
                        delete $output["${key}"];
                    }
                `
			);
		});

		zac.addContent(
			def.unknownKeys !== "strict" || ZodObjectAccelerator.contentPart.strict(),
			def.unknownKeys !== "passthrough" || ZodObjectAccelerator.contentPart.passthrough(),
			"$input = $output",
		);

		return zac;
	}

	static contentPart = {
		typeof: () => ({
			if: /* js */`
                typeof $input !== "object" ||
                $input === null ||
                $input instanceof Array ||
                $input instanceof Promise
            `,
			message: "",
		}),
		strict: () => `
            for(let key in $input){
                if(!$this.shape[key]){
                    new ZodAcceleratorError(\`$path.\${key}\`, "");
                }
            }
        `,
		passthrough: () => `
            for(let key in $input){
                if(!$this.shape[key]){
                    $output[key] = $input[key];
                }
            }
        `,
	};

	static {
		new ZodObjectAccelerator();
	}
}
