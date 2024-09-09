import type * as zod from "zod";
import { ZodAccelerator } from "../accelerator";
import type { ZodAcceleratorContent } from "../content";

@ZodAccelerator.autoInstance
export class ZodEnumAccelerator extends ZodAccelerator {
	public get support() {
		return ZodAccelerator.zod.ZodEnum;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodEnum<[string]>, zac: ZodAcceleratorContent) {
		const def = zodSchema._def;

		zac.addContent(
			ZodEnumAccelerator.contentPart.enum(def.values),
		);

		return zac;
	}

	public static contentPart = {
		enum: (values: string[]) => ({
			if: values.map((value) => `"${value}" !== $input`).join(" && "),
			message: `Input is not equal to ${values.join(" or ")}.`,
		}),
	};
}
