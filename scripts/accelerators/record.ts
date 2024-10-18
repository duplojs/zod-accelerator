import type * as zod from "zod";
import { ZodAccelerator } from "../accelerator";
import { ZodObjectAccelerator } from "./object";
import type { ZodAcceleratorContent } from "../content";

@ZodAccelerator.autoInstance
export class ZodRecordAccelerator extends ZodAccelerator {
	public get support() {
		return ZodAccelerator.zod.ZodRecord;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodRecord<zod.KeySchema>, zac: ZodAcceleratorContent) {
		const def = zodSchema._def;

		const zacValueType = ZodAccelerator.findAcceleratorContent(def.valueType as zod.ZodType);

		let keyType = def.keyType;
		if (keyType instanceof ZodAccelerator.zod.ZodString) {
			keyType = new ZodAccelerator.zod.ZodString({
				...keyType._def,
				coerce: true,
			});
		}

		const zacKeyType = ZodAccelerator.findAcceleratorContent(keyType as zod.ZodType);

		zac.addContent(
			"let $output = {};",
			ZodRecordAccelerator.contentPart.typeof(),
			"for(let $id_key in $input){",
			[
				zacKeyType,
				{
					path: "[Record Key \"${$id_key}\"]",
					input: "$id_key",
					output: "$id_key",
				},
			],
			[
				zacValueType,
				{
					path: "[Record Value \"${$id_key}\"]",
					input: "$input[$id_key]",
					output: "$output[$id_key]",
				},
			],
			"}",
			"$input = $output",
		);

		return zac;
	}

	public static contentPart = {
		...ZodObjectAccelerator.contentPart,
	};
}
