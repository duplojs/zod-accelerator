import * as zod from "zod";
import {ZodAccelerator} from "../accelerator";
import {ZodAcceleratorContent} from "../content";

export class ZodEnumAccelerator extends ZodAccelerator{
	public get support(){
		return zod.ZodEnum;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodEnum<[string]>, zac: ZodAcceleratorContent){
		const def = zodSchema._def;

		zac.addContent(
			ZodEnumAccelerator.contentPart.enum(def.values)
		);

		return zac;
	}

	static contentPart = {
		enum: (values: string[]) => ({
			if: values.map((value) => `"${value}" !== $input`).join(" && "),
			message: `Input is not equal to ${values.join(" or ")}.`
		})
	};

	static {
		new ZodEnumAccelerator();
	}
}
