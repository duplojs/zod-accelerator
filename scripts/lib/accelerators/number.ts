import * as zod from "zod";
import {ZodAccelerator} from "../accelerator";
import {ZodAcceleratorContent} from "../content";

export class ZodNumberAccelerator extends ZodAccelerator{
	public get support(){
		return zod.ZodNumber;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodNumber, zac: ZodAcceleratorContent){
		const def = zodSchema._def;

		zac.addContent(
			def.coerce
				? ZodNumberAccelerator.contentPart.coerce()
				: ZodNumberAccelerator.contentPart.typeof(),
			...def.checks.map(
				check => ZodNumberAccelerator.contentPart[check.kind]?.(check as any)
			)
		);

		return zac;
	}

	static contentPart = {
		coerce: () => `
            $input = new Number($input).valueOf();

            if(Number.isNaN($input)){
                new ZodAcceleratorError(\`$path\`, "");
            }
        `,
		typeof: () => ({
			if: /* js */"(typeof $input !== \"number\")",
			message: "",
		}),
		min: ({value, inclusive}: {value: number, inclusive: boolean}) => ({
			if: /* js */`$input <${!inclusive ? "=" : ""} ${value}`,
			message: "",
		}),
		max: ({value, inclusive}: {value: number, inclusive: boolean}) => ({
			if: /* js */`$input >${!inclusive ? "=" : ""} ${value}`,
			message: "",
		}),
		int: () => ({
			if: /* js */"!Number.isInteger($input)",
			message: "",
		}),
		multipleOf: ({value}: {value: number}) => ({
			if: /* js */`this.duploj$floatSafeRemainder($input, ${value}) !== 0`,
			message: "",
			ctx: {duploj$floatSafeRemainder: ZodNumberAccelerator.floatSafeRemainder}
		}),
		finite: () => ({
			if: /* js */"!Number.isFinite($input)",
			message: "",
		}),
	};

	private static floatSafeRemainder(val: number, step: number){
		const valDecCount = (val.toString().split(".")[1] || "").length;
		const stepDecCount = (step.toString().split(".")[1] || "").length;
		const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
		const valInt = parseInt(val.toFixed(decCount).replace(".", ""));
		const stepInt = parseInt(step.toFixed(decCount).replace(".", ""));
		return (valInt % stepInt) / Math.pow(10, decCount);
	}

	static {
		new ZodNumberAccelerator();
	}
}
