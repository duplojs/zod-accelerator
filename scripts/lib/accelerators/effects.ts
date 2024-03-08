import * as zod from "zod";
import {ZodAccelerator} from "../accelerator";
import {ZodAcceleratorContent} from "../content";

export class ZodEffectAccelerator extends ZodAccelerator{
	public get support(){
		return zod.ZodEffects;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodEffects<zod.ZodAny>, zac: ZodAcceleratorContent){
		const def = zodSchema._def;
        
		zac.addContext({
			transform: def.effect.type === "transform" ? def.effect.transform : undefined,
			refinement: def.effect.type === "refinement" ? def.effect.refinement : undefined,
			preprocess: def.effect.type === "preprocess" ? def.effect.transform : undefined,
		});

		zac.addContent(
			def.effect.type !== "preprocess" || ZodEffectAccelerator.contentPart.preprocess(def.effect.transform.constructor.name === "AsyncFunction"),
			[
				ZodAccelerator.findAcceleratorContent(def.schema),
				{
					path: null,
					input: "$input",
					output: "$input",
				}
			],
			def.effect.type !== "transform" || ZodEffectAccelerator.contentPart.transform(def.effect.transform.constructor.name === "AsyncFunction"),
			def.effect.type !== "refinement" || ZodEffectAccelerator.contentPart.refinement(def.effect.refinement.constructor.name === "AsyncFunction")
		);

		return zac;
	}

	static contentPart = {
		transform: (isAsync: boolean) => `
            $input = ${isAsync ? "await " : ""}$this.transform(
                $input, 
                {
                    path: [], 
                    addIssue: (issue) => {
                        new ZodAcceleratorError(\`$path\`, issue.message || "");
                    }
                }
            )
        `,
		refinement: (isAsync: boolean) => `
            ${isAsync ? "await " : ""}$this.refinement(
                $input, 
                {
                    path: [], 
                    addIssue: (issue) => {
                        new ZodAcceleratorError(\`$path\`, issue.message || "");
                    }
                }
            )
        `,
		preprocess: (isAsync: boolean) => `
            $input = ${isAsync ? "await " : ""}$this.preprocess(
                $input, 
                {
                    path: [], 
                    addIssue: (issue) => {
                        new ZodAcceleratorError(\`$path\`, issue.message || "");
                    }
                }
            )
        `,
	};

	static {
		new ZodEffectAccelerator();
	}
}
