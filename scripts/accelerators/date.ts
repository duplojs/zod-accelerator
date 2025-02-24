import type * as zod from "zod";
import { ZodAccelerator } from "../accelerator";
import type { ZodAcceleratorContent } from "../content";

@ZodAccelerator.autoInstance
export class ZodDateAccelerator extends ZodAccelerator {
	public get support() {
		return ZodAccelerator.zod.ZodDate;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodDate, zac: ZodAcceleratorContent) {
		const def = zodSchema._def;

		zac.addContent(
			def.coerce
				? ZodDateAccelerator.contentPart.coerce()
				: ZodDateAccelerator.contentPart.typeof(),
			...def.checks.map(
				(value) => ZodDateAccelerator.contentPart[value.kind]?.(value as never),
			),
		);

		return zac;
	}

	public static contentPart = {
		coerce: () => `
            $input = new Date($input);

            if(isNaN($input.getTime())){
                return /* cut_execution */ {success: false, error: new ZodAcceleratorError(\`$path\`, "Input is invalide Date.")};
            }
        `,
		typeof: () => ({
			if: /* js */"!($input instanceof Date)",
			message: "Input is invalide Date.",
		}),
		min: ({ value }: { value: number }) => ({
			if: /* js */`$input.getTime() < ${value}`,
			message: `Input Date is less than ${value}.`,
		}),
		max: ({ value }: { value: number }) => ({
			if: /* js */`$input.getTime() > ${value}`,
			message: `Input Date is more than ${value}.`,
		}),
	};
}
