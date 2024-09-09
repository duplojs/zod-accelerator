import type * as zod from "zod";
import { ZodAccelerator } from "../accelerator";
import type { ZodAcceleratorContent } from "../content";

@ZodAccelerator.autoInstance
export class ZodNumberAccelerator extends ZodAccelerator {
	public get support() {
		return ZodAccelerator.zod.ZodNumber;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodNumber, zac: ZodAcceleratorContent) {
		const def = zodSchema._def;

		zac.addContent(
			def.coerce
				? ZodNumberAccelerator.contentPart.coerce()
				: ZodNumberAccelerator.contentPart.typeof(),
			...def.checks.map(
				(check) => ZodNumberAccelerator.contentPart[check.kind]?.(check as never),
			),
		);

		return zac;
	}

	public static contentPart = {
		coerce: () => `
            $input = new Number($input).valueOf();

            if(Number.isNaN($input)){
                return {success: false, error: new ZodAcceleratorError(\`$path\`, "Input is not a Number.")};
            }
        `,
		typeof: () => ({
			if: /* js */"(typeof $input !== \"number\" || Number.isNaN($input))",
			message: "Input is not a Number.",
		}),
		min: ({ value, inclusive }: {
			value: number;
			inclusive: boolean;
		}) => ({
			if: /* js */`$input <${!inclusive ? "=" : ""} ${value}`,
			message: `Input Number is less ${!inclusive ? "or equal " : ""}than ${value}.`,
		}),
		max: ({ value, inclusive }: {
			value: number;
			inclusive: boolean;
		}) => ({
			if: /* js */`$input >${!inclusive ? "=" : ""} ${value}`,
			message: `Input Number is more ${!inclusive ? "or equal " : ""}than ${value}.`,
		}),
		int: () => ({
			if: /* js */"!Number.isInteger($input)",
			message: "Input is not Int.",
		}),
		multipleOf: ({ value }: { value: number }) => ({
			if: /* js */`this.duploj$floatSafeRemainder($input, ${value}) !== 0`,
			message: `Input Number is not multiple of ${value}.`,
			ctx: { duploj$floatSafeRemainder: ZodNumberAccelerator.floatSafeRemainder },
		}),
		finite: () => ({
			if: /* js */"!Number.isFinite($input)",
			message: "Input Number is not finite.",
		}),
	};

	private static floatSafeRemainder(val: number, step: number) {
		const valDecCount = (val.toString().split(".")[1] || "").length;
		const stepDecCount = (step.toString().split(".")[1] || "").length;
		const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
		const valInt = parseInt(val.toFixed(decCount).replace(".", ""));
		const stepInt = parseInt(step.toFixed(decCount).replace(".", ""));
		return (valInt % stepInt) / Math.pow(10, decCount);
	}
}
