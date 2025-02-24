import type { ZodAcceleratorContent } from "@scripts/content";
import type { ZodType } from "zod";
import { ZodAccelerator } from "../accelerator";
import { zodSchemaIsAsync } from "..";

@ZodAccelerator.autoInstance
export class ZodTypeAccelerator extends ZodAccelerator {
	public get support(): any {
		return ZodAccelerator.zod.ZodType;
	}

	public makeAcceleratorContent(zodSchema: ZodType, zac: ZodAcceleratorContent) {
		const isAsync = zodSchemaIsAsync(zodSchema);
		const parseMethod = isAsync ? "safeParseAsync" : "safeParse";
		const mayBeAwait = isAsync ? "await" : "";

		zac.addContent({
			content: `
				const $output = ${mayBeAwait} $this.zodSchema.${parseMethod}($input);

				if($output.success === false){
					return /* cut_execution */ {success: false, error: new ZodAcceleratorError(\`$path\`, "ZodSchema Fail parse.")};
				}

				$input = $output.data;
			`,
			ctx: {
				zodSchema,
			},
		});

		return zac;
	}
}
