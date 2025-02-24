import { ZodAcceleratorError } from "./error";
import type { AnyFunction } from "@utils/types";
import { shadowEval } from "@utils/shadowEval";

export interface AcceleratorParams {
	path: string | null;
	input: string;
	output: string;
}
export type AcceleratorContentType = (
	| string
	| {
		message?: string;
		if?: string;
		content?: string;
		ctx?: Record<keyof any, any>;
	}
    | [ZodAcceleratorContent, AcceleratorParams]
    | null
    | undefined
    | boolean
)[];

export class ZodAcceleratorContent {
	private static readonly replacerList = {
		$input: "{id}_input",
		$output: "{id}_output",
		"$this.": "this.{id}_",
		$id: "{id}",
	};

	private static inc = 0;

	public readonly id = ZodAcceleratorContent.generateId();

	public content: string[] = [];

	public readonly ctx: Record<keyof any, any> = {};

	public addContent(
		...content: AcceleratorContentType
	) {
		this.content.push(
			...content.map((value) => {
				if (typeof value === "string") {
					return value;
				} else if (!value || value === true) {
					return "";
				} else if (value instanceof Array) {
					this.addContext(value[0].ctx);
					return value[0].exportContent({
						path: value[1].path ? this.replacer(value[1].path) : null,
						input: this.replacer(value[1].input),
						output: this.replacer(value[1].output),
					});
				}
				if (value.ctx) {
					this.addContext(value.ctx);
				}
				if (value.content) {
					return value.content;
				}

				return `
                    if(${value.if ?? "true"}){
                        return /* cut_execution */ {success: false, error: new ZodAcceleratorError(\`$path\`, "${value.message ?? ""}")};
                    }
                `;
			}),
		);
	}

	public addContext(ctx: Record<string, any>) {
		Object.entries(ctx).forEach(([key, value]) => {
			if (key.startsWith("duploj$")) {
				this.ctx[key] = value;
			} else {
				this.ctx[`${this.id}_${key}`] = value;
			}
		});
	}

	public exportContent(params: AcceleratorParams) {
		const content = this.replacer(
			[
				/* js */`let $input = ${params.input};`,
				...this.content,
				/* js */`${params.output} = $input;`,
			]
				.join("\n"),
		);

		if (params.path) {
			return content.replaceAll("$path", `$path.${params.path}`);
		} else {
			return content;
		}
	}

	public toFunction() {
		const functionContent = this.replacer(
			[
				"function ($input){",
				/* js */"const ZodAcceleratorError = this.ZodAcceleratorError;",
				...this.content,
				/* js */"return /* cut_execution */ {success: true, data: $input};",
				"}",
			]
				.join("\n"),
		)
			.replace(/\$path\.?/g, ".");

		const fnc: AnyFunction = shadowEval(`(${functionContent.includes("await") ? "async " : ""}${functionContent})`);

		return fnc.bind({
			ZodAcceleratorError: ZodAcceleratorError,
			...this.ctx,
		});
	}

	public replacer(content: string) {
		let remplecedContent = content;

		Object.entries(ZodAcceleratorContent.replacerList).forEach(([key, value]) => {
			remplecedContent = remplecedContent.replaceAll(
				key,
				value.replace("{id}", this.id),
			);
		});

		return remplecedContent;
	}

	private static generateId() {
		return `duploj$${(this.inc++)}`;
	}
}
