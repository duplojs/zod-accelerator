import * as zod from "zod";
import { ZodAccelerator } from "../accelerator";
import type { ZodAcceleratorContent } from "../content";
import { zodSchemaIsAsync } from "..";

@ZodAccelerator.autoInstance
export class ZodEffectAccelerator extends ZodAccelerator {
	public get support() {
		return ZodAccelerator.zod.ZodEffects;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodEffects<zod.ZodAny>, zac: ZodAcceleratorContent) {
		const def = zodSchema._def;
		const async = zodSchemaIsAsync(zodSchema);

		zac.addContext({
			transform: def.effect.type === "transform" ? def.effect.transform : undefined,
			refinement: def.effect.type === "refinement" ? def.effect.refinement : undefined,
			preprocess: def.effect.type === "preprocess" ? def.effect.transform : undefined,
			duploj$Never: zod.NEVER,
		});

		zac.addContent(
			def.effect.type !== "preprocess" || ZodEffectAccelerator.contentPart.preprocess(async),
			[
				ZodAccelerator.findAcceleratorContent(def.schema),
				{
					path: null,
					input: "$input",
					output: "$input",
				},
			],
			def.effect.type !== "transform" || ZodEffectAccelerator.contentPart.transform(async),
			def.effect.type !== "refinement" || ZodEffectAccelerator.contentPart.refinement(async),
		);

		return zac;
	}

	public static contentPart = {
		transform: (isAsync: boolean) => `
			let $id_issue;
            $input = ${isAsync ? "await " : ""}$this.transform(
                $input, 
                {
                    path: [], 
                    addIssue: (issue) => {
                        $id_issue = {success: false, error: new ZodAcceleratorError(\`$path\`, issue.message || "Effect transform issue without message.")};
                    }
                }
            )

			if($id_issue || $input === this.duploj$Never){
				return $id_issue || {success: false, error: new ZodAcceleratorError(\`$path\`, "Effect return never.")};
			}
        `,
		refinement: (isAsync: boolean) => `
			let $id_issue;
            ${isAsync ? "await " : ""}$this.refinement(
                $input, 
                {
                    path: [], 
                    addIssue: (issue) => {
                        $id_issue = {success: false, error: new ZodAcceleratorError(\`$path\`, issue.message || "Effect refinement issue without message.")};
                    }

                }
            )

			if($id_issue || $input === this.duploj$Never){
				return $id_issue || {success: false, error: new ZodAcceleratorError(\`$path\`, "Effect return never.")};
			}
        `,
		preprocess: (isAsync: boolean) => `
			let $id_issue;
            $input = ${isAsync ? "await " : ""}$this.preprocess(
                $input, 
                {
                    path: [], 
                    addIssue: (issue) => {
                        $id_issue = {success: false, error: new ZodAcceleratorError(\`$path\`, issue.message || "Effect preprocess issue without message.")};
                    }
                }
            )

			if($id_issue || $input === this.duploj$Never){
				return $id_issue || {success: false, error: new ZodAcceleratorError(\`$path\`, "Effect return never.")};
			}
        `,
	};
}
