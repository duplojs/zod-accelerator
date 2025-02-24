import type * as zod from "zod";
import { ZodAccelerator } from "../accelerator";
import type { ZodAcceleratorContent } from "../content";

@ZodAccelerator.autoInstance
export class ZodBigIntAccelerator extends ZodAccelerator {
	public get support() {
		return ZodAccelerator.zod.ZodBigInt;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodBigInt, zac: ZodAcceleratorContent) {
		const def = zodSchema._def;

		zac.addContent(
			def.coerce
				? ZodBigIntAccelerator.contentPart.coerce()
				: ZodBigIntAccelerator.contentPart.typeof(),
			...def.checks.map(
				(check) => ZodBigIntAccelerator.contentPart[check.kind]?.(check as never),
			),
		);

		return zac;
	}

	public static contentPart = {
		coerce: () => `
            try {
                $input = BigInt($input).valueOf();
            } catch {
                return /* cut_execution */ {success: false, error: new ZodAcceleratorError(\`$path\`, "Input is not BigInt.")};
            }
        `,
		typeof: () => ({
			if: /* js */"(typeof $input !== \"bigint\")",
			message: "Input is not BigInt.",
		}),
		multipleOf: ({ value }: { value: bigint }) => ({
			if: /* js */`$input % ${value.toString()}n !== BigInt(0)`,
			message: `Input BigInt is not multiple of ${value}.`,
		}),
		min: ({ value }: { value: number }) => ({
			if: /* js */`$input <= ${value}`,
			message: `Input BigInt is less or equal than ${value}.`,
		}),
		max: ({ value }: { value: number }) => ({
			if: /* js */`$input >= ${value}`,
			message: `Input BigInt is more or equal than ${value}.`,
		}),
	};
}
