import type * as zod from "zod";
import { ZodAccelerator } from "../accelerator";
import type { ZodAcceleratorContent } from "../content";

@ZodAccelerator.autoInstance
export class ZodDefaultAccelerator extends ZodAccelerator {
	public get support() {
		return ZodAccelerator.zod.ZodDefault;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodDefault<zod.ZodAny>, zac: ZodAcceleratorContent) {
		const def = zodSchema._def;
		const zacInnerType = ZodAccelerator.findAcceleratorContent(def.innerType);

		zac.addContext({
			defaultValue: def.defaultValue,
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
				},
			],
			"}",
		);

		return zac;
	}

	public static contentPart = {
		default: () => /* js */`
            if($input === undefined){
                $input = $this.defaultValue()
            }
        `,
	};
}
