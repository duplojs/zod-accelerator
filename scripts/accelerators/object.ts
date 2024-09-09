import * as zod from "zod";
import { ZodAccelerator } from "../accelerator";
import type { ZodAcceleratorContent } from "../content";

@ZodAccelerator.autoInstance
export class ZodObjectAccelerator extends ZodAccelerator {
	public get support() {
		return ZodAccelerator.zod.ZodObject;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodObject<Record<keyof any, any>>, zac: ZodAcceleratorContent) {
		const def = zodSchema._def;
		const shape = def.shape();

		zac.addContext({
			shape: Object.keys(shape).reduce<Record<string, true>>(
				(pv, cv) => {
					pv[cv] = true;
					return pv;
				},
				{},
			),
		});

		zac.addContent(
			"let $output = {};",
			ZodObjectAccelerator.contentPart.typeof(),
		);

		Object.entries(shape).forEach(([key, zodSchema]) => {
			const propsZac = ZodAccelerator.findAcceleratorContent(zodSchema as zod.ZodType);
			if (
				zodSchema instanceof zod.ZodUndefined
				|| zodSchema instanceof zod.ZodVoid
				|| zodSchema instanceof zod.ZodUnknown
				|| zodSchema instanceof zod.ZodAny
				|| zodSchema instanceof zod.ZodOptional
				|| zodSchema instanceof zod.ZodDefault
				|| (
					zodSchema instanceof zod.ZodLiteral
					&& zodSchema._def.value === undefined
				)
			) {
				zac.addContent(
					[
						propsZac,
						{
							path: key,
							input: `$input["${key}"]`,
							output: "//",
						},
					],
					/* js */`
						if(${propsZac.replacer("$input")} != undefined){
							$output["${key}"] = ${propsZac.replacer("$input")}
						}
					`,
				);
			} else {
				zac.addContent(
					[
						propsZac,
						{
							path: key,
							input: `$input["${key}"]`,
							output: `$output["${key}"]`,
						},
					],
				);
			}
		});

		zac.addContent(
			def.unknownKeys !== "strict" || ZodObjectAccelerator.contentPart.strict(),
			def.unknownKeys !== "passthrough" || ZodObjectAccelerator.contentPart.passthrough(),
			"$input = $output",
		);

		return zac;
	}

	public static contentPart = {
		typeof: () => ({
			if: /* js */`
                typeof $input !== "object" ||
                $input === null ||
                $input instanceof Array ||
                $input instanceof Promise
            `,
			message: "Input is not Object.",
		}),
		strict: () => `
            for(let key in $input){
                if(!$this.shape[key]){
                    return {success: false, error: new ZodAcceleratorError(\`$path.\${key}\`, "Input Object has key to many.")};
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
}
