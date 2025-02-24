/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import * as zod from "zod";
import { ZodAccelerator } from "../accelerator";
import type { ZodAcceleratorContent } from "../content";
import { ZodAcceleratorError } from "../error";
import type { AcceleratorSafeParseError } from "../parser";

@ZodAccelerator.autoInstance
export class ZodIntersectionAccelerator extends ZodAccelerator {
	public get support() {
		return ZodAccelerator.zod.ZodIntersection;
	}

	public makeAcceleratorContent(
		zodSchema: zod.ZodIntersection<zod.ZodType, zod.ZodType>,
		zac: ZodAcceleratorContent,
	) {
		const def = zodSchema._def;

		zac.addContext({
			duploj$mergeValues: ZodIntersectionAccelerator.mergeValues,
		});

		zac.addContent(
			/* js */`
                let $id_left_output;
                let $id_right_output;
            `,
		);

		(["left", "right"] as const).forEach((value) => {
			zac.addContent(
				[
					ZodAccelerator.findAcceleratorContent(def[value]),
					{
						path: null,
						input: "$input",
						output: `$id_${value}_output`,
					},
				],
			);
		});

		zac.addContent(ZodIntersectionAccelerator.contentPart.mergeValues());

		return zac;
	}

	public static contentPart = {
		mergeValues: () => `
			let $id_resultMergeValues = this.duploj$mergeValues($id_left_output, $id_right_output, \`$path\`);
			if(!$id_resultMergeValues.success){
				return /* cut_execution */ $id_resultMergeValues;
			}
			$input = $id_resultMergeValues.data;
	   `,
	};

	public static mergeValues(
		aa: any,
		bb: any,
		path: string,
	): AcceleratorSafeParseError<any> {
		const aType = zod.getParsedType(aa);
		const bType = zod.getParsedType(bb);

		if (aa === bb) {
			return {
				success: true,
				data: aa,
			};
		} else if (aType === zod.ZodParsedType.object && bType === zod.ZodParsedType.object) {
			const bKeys = Object.keys(bb as never);
			const sharedKeys = Object.keys(aa as never).filter((key) => bKeys.includes(key));

			const newObj: any = {
				...aa,
				...bb,
			};
			for (const key of sharedKeys) {
				const result = ZodIntersectionAccelerator.mergeValues(aa[key], bb[key], path);
				if (!result.success) {
					return result;
				}
				newObj[key] = result.data;
			}

			return {
				success: true,
				data: newObj,
			};
		} else if (aType === zod.ZodParsedType.array && bType === zod.ZodParsedType.array) {
			if (aa.length !== bb.length) {
				return {
					success: false,
					error: new ZodAcceleratorError(path, "Intersection results could not be merged."),
				};
			}

			const newArray = [];
			for (let index = 0; index < aa.length; index++) {
				const itemA = aa[index];
				const itemB = bb[index];
				const result = ZodIntersectionAccelerator.mergeValues(itemA, itemB, path);
				if (!result.success) {
					return result;
				}
				newArray.push(result.data);
			}

			return {
				success: true,
				data: newArray,
			};
		} else if (
			aType === zod.ZodParsedType.date
            && bType === zod.ZodParsedType.date
            && Number(aa) === Number(bb)
		) {
			return {
				success: true,
				data: aa,
			};
		} else {
			return {
				success: false,
				error: new ZodAcceleratorError(path, "Intersection results could not be merged."),
			};
		}
	}
}
