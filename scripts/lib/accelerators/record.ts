import * as zod from "zod";
import {ZodAccelerator} from "../accelerator";
import {ZodObjectAccelerator} from "./object";
import {ZodAcceleratorContent} from "../content";

export class ZodRecordAccelerator extends ZodAccelerator{
	public get support(){
		return zod.ZodRecord;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodRecord, zac: ZodAcceleratorContent){
		const def = zodSchema._def;
        
		const zacValueType = ZodAccelerator.findAcceleratorContent(def.valueType);
        
		const keyType = def.keyType;
		if(keyType instanceof zod.ZodNumber || keyType instanceof zod.ZodString){
			//@ts-ignore
			keyType._def.coerce = true;
		}
		const zacKeyType = ZodAccelerator.findAcceleratorContent(def.keyType);
        
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
				}
			],
			[
				zacValueType,
				{
					path: "[Record Value \"${$id_key}\"]",
					input: "$input[$id_key]",
					output: "$output[$id_key]",
				}
			],
			"}",
			"$input = $output"
		);

		return zac;
	}

	static contentPart = {
		...ZodObjectAccelerator.contentPart
	};

	static {
		new ZodRecordAccelerator();
	}
}
