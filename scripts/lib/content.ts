import {AnyFunction} from "@duplojs/duplojs";
import {ZodAcceleratorError} from "./error";

export type AcceleratorParams = {path: string | null, input: string, output: string};
export type AcceleratorContentType = (string 
    | {message?: string, if?: string, content?: string, ctx?: Record<keyof any, any>}
    | [ZodAcceleratorContent, AcceleratorParams]
    | null 
    | undefined 
    | boolean
)[]

export class ZodAcceleratorContent{
	private static readonly replacerList = {
		"$input": "{id}_input",
		"$output": "{id}_output",
		"$this.": "this.{id}_",
		"$id": "{id}",
	};
	private static inc = 0;

	readonly id = ZodAcceleratorContent.generateId();
	content: string[] = [];
	readonly ctx: Record<keyof any, any> = {};
    
	constructor(){}

	addContent(
		...content: AcceleratorContentType
	){
		this.content.push(
			...content.map(value => {
				if(typeof value === "string") return value;
				else if(!value || value === true) return "";
				else if(value instanceof Array){
					this.addContext(value[0].ctx);
					return value[0].exportContent({
						path: value[1].path ? this.replacer(value[1].path) : null,
						input: this.replacer(value[1].input),
						output: this.replacer(value[1].output),
					});
				}
				if(value.ctx) this.addContext(value.ctx);
				if(value.content) return value.content;
                
				return `
                    if(${value.if ?? "true"}){
                        return {success: false, error: new ZodAcceleratorError(\`$path\`, "${value.message ?? ""}")};
                    }
                `;
			})
		);
	}

	addContext(ctx: Record<string, any>){
		Object.entries(ctx).forEach(([key, value]) => {
			if(key.startsWith("duploj$")) this.ctx[key] = value;
			else this.ctx[`${this.id}_${key}`] = value;
		});
	}

	exportContent(params: AcceleratorParams){
		const content = this.replacer(
			[
				/* js */`let $input = ${params.input};`,
				...this.content,
				/* js */`${params.output} = $input;`,
			]
			.join("\n")
		);
        
		if(params.path) return content.replaceAll("$path", `$path.${params.path}`);
		else return content;
	}

	toFunction(){
		const isAsync = !!this.content.find(c => c.includes("await"));

        
		const functionContent = this.replacer(
			[
				`(${isAsync ? "async " : ""}function ($input){`,
				/* js */"const ZodAcceleratorError = this.ZodAcceleratorError;",
				...this.content,
				/* js */"return {success: true, data: $input};",
				"})"
			]
			.join("\n")
		)
		.replace(/\$path\.?/g, ".");

		const fnc: AnyFunction = eval(functionContent);

		return fnc.bind({
			ZodAcceleratorError: ZodAcceleratorError,
			...this.ctx
		});
	}

	replacer(content: string){
		Object.entries(ZodAcceleratorContent.replacerList).forEach(([key, value]) => {
			content = content.replaceAll(
				key, 
				value.replace("{id}", this.id)
			);
		});
		return content;
	}

	private static generateId(){
		return `duploj$${(this.inc++)}`;
	}
}
