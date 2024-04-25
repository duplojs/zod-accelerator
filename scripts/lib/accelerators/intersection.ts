import * as zod from "zod";
import {ZodAccelerator} from "../accelerator";
import {ZodAcceleratorContent} from "../content";
import {ZodAcceleratorError} from "../error";
import {AcceleratorSafeParseError} from "../parser";

@ZodAccelerator.autoInstance
export class ZodIntersectionAccelerator extends ZodAccelerator{
	public get support(){
		return ZodAccelerator.zod.ZodIntersection;
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

		zac.addContent(ZodIntersectionAccelerator.contentPart.mergeValues());
        
		return zac;
	}

	static contentPart = {
		mergeValues: () => /* js */`
			let $id_resultMergeValues = this.duploj$mergeValues($id_left_output, $id_right_output);
			if(!$id_resultMergeValues.success){
				return $id_resultMergeValues;
			}
			$input = $id_resultMergeValues.data;
	   `
	};

	static mergeValues(
		a: any,
		b: any,
		path: string
	): AcceleratorSafeParseError<any>{
		const aType = zod.getParsedType(a);
		const bType = zod.getParsedType(b);
        
		if(a === b){
			return {success: true, data: a};
		} 
		else if(aType === zod.ZodParsedType.object && bType === zod.ZodParsedType.object){
			const bKeys = Object.keys(b);
			const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
        
			const newObj: any = {...a, ...b};
			for(const key of sharedKeys){
				const result = ZodIntersectionAccelerator.mergeValues(a[key], b[key], path);
				if(!result.success){
					return result;
				}
				newObj[key] = result.data;
			}
      
			return {success: true, data: newObj};
		} 
		else if(aType === zod.ZodParsedType.array && bType === zod.ZodParsedType.array){
			if(a.length !== b.length){
				return {success: false, error: new ZodAcceleratorError(path, "Intersection results could not be merged.")};
			}
        
			const newArray = [];
			for(let index = 0; index < a.length; index++){
				const itemA = a[index];
				const itemB = b[index];
				const result = ZodIntersectionAccelerator.mergeValues(itemA, itemB, path);
				if(!result.success){
					return result;
				}
				newArray.push(result.data);
			}

			return {success: true, data: newArray};
		} 
		else if(
			aType === zod.ZodParsedType.date &&
            bType === zod.ZodParsedType.date &&
            +a === +b
		){
			return {success: true, data: a};
		} 
		else {
			return {success: false, error: new ZodAcceleratorError(path, "Intersection results could not be merged.")};
		}
	}
}
