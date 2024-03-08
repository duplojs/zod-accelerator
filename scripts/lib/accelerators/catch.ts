import * as zod from "zod";
import {ZodAccelerator} from "../accelerator";
import {ZodAcceleratorContent} from "../content";

export class ZodCatchAccelerator extends ZodAccelerator{
	public get support(){
		return zod.ZodCatch;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodCatch<zod.ZodAny>, zac: ZodAcceleratorContent){
		const def = zodSchema._def;
		const zacInnerType = ZodAccelerator.findAcceleratorContent(def.innerType);
		const innerTypeZacContent = zacInnerType.exportContent({
			path: null,
			input: zac.replacer("$input"),
			output: zac.replacer("$output"),
		});

		zac.addContext({
			catchValue: def.catchValue,
			duploj$EMPTY: ZodCatchAccelerator.EMPTY
		});
		zac.addContext(zacInnerType.ctx);

		zac.addContent(
			"let $output = this.duploj$EMPTY;",
			"$id_catch :{",
			innerTypeZacContent
			.split("\n")
			.map(
				line => line.includes("new ZodAcceleratorError") ? "break $id_catch;" : line
			)
			.join("\n"),
			"}",
			ZodCatchAccelerator.contentPart.checkOutput(),
			"$input = $output;",
		);

		return zac;
	}

	static contentPart = {
		checkOutput: () => /* js */`
            if($output === this.duploj$EMPTY){
                $output = $this.catchValue()
            }
        `
	};

	static EMPTY = Symbol("empty");

	static {
		new ZodCatchAccelerator();
	}
}
