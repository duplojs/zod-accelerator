import * as zod from "zod";
import {ZodAcceleratorContent} from "./content";
import {ZodAcceleratorParser} from "./parser";
import {ZodAcceleratorError} from "./error";

declare module "zod" {
	interface ZodType{
		accelerator?: ZodAcceleratorParser<this>;
	}
}

export abstract class ZodAccelerator{
	protected static accelerators: ZodAccelerator[] = [];

	public abstract get support(): any;
	public abstract makeAcceleratorContent(zodSchema: zod.ZodType, zac: ZodAcceleratorContent): ZodAcceleratorContent

	protected static findAcceleratorContent(zodSchema: zod.ZodType, ignoreSchemaAccelerator: boolean = false){
		for(const accelerator of this.accelerators){
			if(zodSchema instanceof accelerator.support){
				const zac = new ZodAcceleratorContent();

				if(
					zodSchema.accelerator !== undefined &&
					ignoreSchemaAccelerator === false
				){
					zac.addContext({
						zodSchema
					});

					zac.addContent(`
						let $output = $this.zodSchema.accelerator.safeParse($input);

						if($output.success === false){
							$output.error.message = $output.error.message.replace(".", \`$path.\`);
							return $output;
						}

						$input = $output.data;
					`);

					return zac;
				}

				return accelerator.makeAcceleratorContent(zodSchema, zac);
			}
		}

		throw new Error(`No accelerator found for type: ${zodSchema.constructor.name}`);
	}

	public static build<
		_zodSchema extends zod.ZodType
	>(zodSchema: _zodSchema){
		zodSchema.accelerator = new ZodAcceleratorParser<any>(
			() => ({success: false, error: new ZodAcceleratorError("", "")})
		);

		const accelerator = new ZodAcceleratorParser<_zodSchema>(
			this.findAcceleratorContent(zodSchema, true).toFunction()
		);

		zodSchema.accelerator = accelerator;

		return accelerator;
	}

	public static autoInstance(zodAccelerator: { new(...args: any[]): ZodAccelerator }){
		ZodAccelerator.accelerators.push(new zodAccelerator());
	}
}
