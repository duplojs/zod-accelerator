import * as zod from "zod";
import {ZodNumberAccelerator} from "./number";
import {ZodAccelerator} from "../accelerator";
import {ZodAcceleratorContent} from "../content";

export class ZodBigIntAccelerator extends ZodAccelerator{
	public get support(){
		return zod.ZodBigInt;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodBigInt, zac: ZodAcceleratorContent){
		const def = zodSchema._def;

		zac.addContent(
			def.coerce
				? ZodBigIntAccelerator.contentPart.coerce()
				: ZodBigIntAccelerator.contentPart.typeof(),
			...def.checks.map(
				check => ZodBigIntAccelerator.contentPart[check.kind]?.(check as any)
			)
		);

		return zac;
	}

	static contentPart = {
		coerce: () => /* js */`
            try {
                $input = BigInt($input).valueOf();
            } catch {
                new ZodAcceleratorError(\`$path\`, "");
            }
        `,
		typeof: () => ({
			if: /* js */"(typeof $input !== \"bigint\")",
			message: "",
		}),
		multipleOf: ({value}: {value: bigint}) => ({
			if: /* js */`$input % ${value.toString()}n !== BigInt(0)`,
			message: "",
		}),
		min: ({value}: {value: number}) => ({
			if: /* js */`$input <= ${value}`,
			message: "",
		}),
		max: ({value}: {value: number}) => ({
			if: /* js */`$input >= ${value}`,
			message: "",
		}),
	};

	static {
		new ZodBigIntAccelerator();
	}
}
