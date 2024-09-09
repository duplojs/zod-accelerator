import type * as zod from "zod";
import { ZodAccelerator } from "../accelerator";
import type { ZodAcceleratorContent } from "../content";

@ZodAccelerator.autoInstance
export class ZodSymbolAccelerator extends ZodAccelerator {
	public get support() {
		return ZodAccelerator.zod.ZodSymbol;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodSymbol, zac: ZodAcceleratorContent) {
		zac.addContent(
			ZodSymbolAccelerator.contentPart.typeof(),
		);

		return zac;
	}

	public static contentPart = {
		typeof: () => ({
			if: /* js */"(typeof $input !== \"symbol\")",
			message: "Input is not a Symbol.",
		}),
	};
}
