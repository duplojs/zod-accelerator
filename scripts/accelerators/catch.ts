import type * as zod from "zod";
import { ZodAccelerator } from "../accelerator";
import type { ZodAcceleratorContent } from "../content";

@ZodAccelerator.autoInstance
export class ZodCatchAccelerator extends ZodAccelerator {
	public get support() {
		return ZodAccelerator.zod.ZodCatch;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodCatch<zod.ZodAny>, zac: ZodAcceleratorContent) {
		const def = zodSchema._def;
		const zacInnerType = ZodAccelerator.findAcceleratorContent(def.innerType);
		const innerTypeZacContent = zacInnerType.exportContent({
			path: null,
			input: zac.replacer("$input"),
			output: zac.replacer("$output"),
		});

		zac.addContext({
			catchValue: def.catchValue,
			duploj$EMPTY: ZodCatchAccelerator.EMPTY,
		});
		zac.addContext(zacInnerType.ctx);

		zac.addContent(
			"let $output = this.duploj$EMPTY;",
			"$id_catch :{",
			innerTypeZacContent
				.split("\n")
				.map(
					(line) => line.includes("return") ? "break $id_catch;" : line,
				)
				.join("\n"),
			"}",
			ZodCatchAccelerator.contentPart.checkOutput(),
			"$input = $output;",
		);

		return zac;
	}

	public static contentPart = {
		checkOutput: () => /* js */`
            if($output === this.duploj$EMPTY){
                $output = $this.catchValue()
            }
        `,
	};

	public static EMPTY = Symbol("empty");
}
