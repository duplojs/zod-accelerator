import type * as zod from "zod";
import { ZodAccelerator } from "../accelerator";
import type { ZodAcceleratorContent } from "../content";

@ZodAccelerator.autoInstance
export class ZodUnionAccelerator extends ZodAccelerator {
	public get support() {
		return ZodAccelerator.zod.ZodUnion;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodUnion<[zod.ZodType]>, zac: ZodAcceleratorContent) {
		const def = zodSchema._def;

		zac.addContext({
			EMPTY: ZodUnionAccelerator.EMPTY,
		});

		zac.addContent(
			"let $output = $this.EMPTY;",
			"let $id_reasons = {}",
			"$id_union :{",
		);

		def.options.forEach((value, index) => {
			const childZac = ZodAccelerator.findAcceleratorContent(value);
			const childZacContent = childZac.exportContent({
				path: `[Union ${index}]`,
				input: zac.replacer("$input"),
				output: zac.replacer("$output"),
			});
			zac.addContext(childZac.ctx);

			zac.addContent(
				`$id_union_child_${index} :{`,
				childZacContent
					.split("\n")
					.map(
						(line) => line.includes("return /* cut_execution */")
							? `break $id_union_child_${index};`
							: line,
					)
					.join("\n"),
				"break $id_union;",
				"}",
			);
		});

		zac.addContent(
			"}",
			ZodUnionAccelerator.contentPart.checkOutput(),
			"$input = $output;",
		);

		return zac;
	}

	public static contentPart = {
		checkOutput: () => `
			if($output === $this.EMPTY) {
				return /* cut_execution */ {success: false, error: new ZodAcceleratorError(\`$path\`, "Input has no correspondence in union.")}
			}
		`,
	};

	public static EMPTY = Symbol("empty");
}
