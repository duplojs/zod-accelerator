import * as zod from "zod";
import {ZodAccelerator} from "../accelerator";
import {ZodAcceleratorContent} from "../content";
import {ZodAcceleratorError} from "../error";

export class ZodIntersectionAccelerator extends ZodAccelerator{
	public get support(){
		return zod.ZodIntersection;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodIntersection<zod.ZodType, zod.ZodType>, zac: ZodAcceleratorContent){
		const def = zodSchema._def;

		zac.addContext({
			duploj$mergeValues: ZodIntersectionAccelerator.mergeValues
		});

		zac.addContent(
			/* js */`
                let $id_left_output;
                let $id_right_output;
            `
		);
        
		(["left", "right"] as const).forEach(value => {
			zac.addContent(
				[
					ZodAccelerator.findAcceleratorContent(def[value]),
					{
						path: null,
						input: "$input",
						output: `$id_${value}_output`,
					}
				]
			);
		});

		zac.addContent(
			/* js */`
                $input = this.duploj$mergeValues($id_left_output, $id_right_output)
            `
		);
        
		return zac;
	}

	static contentPart = {
       
	};

	static mergeValues(
		a: any,
		b: any,
		path: string
	): any{
		const aType = zod.getParsedType(a);
		const bType = zod.getParsedType(b);
        
		if(a === b){
			return a;
		} 
		else if(aType === zod.ZodParsedType.object && bType === zod.ZodParsedType.object){
			const bKeys = Object.keys(b);
			const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
        
			const newObj: any = {...a, ...b};
			for(const key of sharedKeys){
				const sharedValue = ZodIntersectionAccelerator.mergeValues(a[key], b[key], path);
				newObj[key] = sharedValue;
			}
      
			return newObj;
		} 
		else if(aType === zod.ZodParsedType.array && bType === zod.ZodParsedType.array){
			if(a.length !== b.length){
				new ZodAcceleratorError(path, "");
			}
        
			const newArray = [];
			for(let index = 0; index < a.length; index++){
				const itemA = a[index];
				const itemB = b[index];
				const sharedValue = ZodIntersectionAccelerator.mergeValues(itemA, itemB, path);
				newArray.push(sharedValue);
			}
        
			return newArray;
		} 
		else if(
			aType === zod.ZodParsedType.date &&
            bType === zod.ZodParsedType.date &&
            +a === +b
		){
			return a;
		} 
		else {
			new ZodAcceleratorError(path, "");
		}
	}

	static {
		new ZodIntersectionAccelerator();
	}
}

