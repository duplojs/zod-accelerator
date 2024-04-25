import * as zod from "zod";
import {ZodAccelerator} from "../accelerator";
import {ZodAcceleratorContent} from "../content";

@ZodAccelerator.autoInstance
export class ZodUnionAccelerator extends ZodAccelerator{
	public get support(){
		return ZodAccelerator.zod.ZodUnion;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodUnion<[zod.ZodType]>, zac: ZodAcceleratorContent){
		const def = zodSchema._def;

		zac.addContext({
			duploj$EMPTY: ZodUnionAccelerator.EMPTY
		});

		zac.addContent(
			"let $output = this.duploj$EMPTY;",
			"$id_union :{",
		);

		def.options.forEach((value, index) => {
			const childZac = ZodAccelerator.findAcceleratorContent(value);
			const childZacContent = childZac.exportContent({
				path: null,
				input: zac.replacer("$input"),
				output: zac.replacer("$output"),
			});
			zac.addContext(childZac.ctx);

			zac.addContent(
				`$id_union_child_${index} :{`,
				childZacContent
				.split("\n")
				.map(
					line => line.includes("return") ? `break $id_union_child_${index};` : line
				)
				.join("\n"),
				"break $id_union;",
				"}",
			);
		});

		zac.addContent(
			"}",
			ZodUnionAccelerator.contentPart.checkOutput(),
			"$input = $output;"
		);
        
		return zac;
	}

	static contentPart = {
		checkOutput: () => ({
			if: /* js */"$output === this.duploj$EMPTY",
			message: "Input has no correspondence in union."
		})
	};

	static EMPTY = Symbol("empty");
}
