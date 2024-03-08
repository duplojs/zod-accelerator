import * as zod from "zod";
import {ZodAccelerator} from "../accelerator";
import {ZodAcceleratorContent} from "../content";

export class ZodDateAccelerator extends ZodAccelerator{
	public get support(){
		return zod.ZodDate;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodDate, zac: ZodAcceleratorContent){
		const def = zodSchema._def;

		zac.addContent(
			def.coerce
				? ZodDateAccelerator.contentPart.coerce()
				: ZodDateAccelerator.contentPart.typeof(),
			...def.checks.map(
				value => ZodDateAccelerator.contentPart[value.kind]?.(value as any)
			)
		);

		return zac;
	}

	static contentPart = {
		coerce: () => /* js */`
            $input = new Date($input);

            if(isNaN($input.getTime())){
                new ZodAcceleratorError(\`$path\`, "");
            }
        `,
		typeof: () => ({
			if: /* js */"!($input instanceof Date)",
			message: "",
		}),
		min: ({value}: {value: number}) => ({
			if: /* js */`$input.getTime() < ${value}`,
			message: "",
		}),
		max: ({value}: {value: number}) => ({
			if: /* js */`$input.getTime() > ${value}`,
			message: "",
		}),
	};

	static {
		new ZodDateAccelerator();
	}
}
