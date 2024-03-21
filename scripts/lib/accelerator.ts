import * as zod from "zod";
import {ZodAcceleratorContent} from "./content";
import {ZodAcceleratorParser} from "./parser";
import {AbstractRoute, DuploConfig, DuploInstance, Process, Route} from "@duplojs/duplojs";
import {duploExtends, duploInject} from "@duplojs/editor-tools";
import {ZodAcceleratorError} from "./error";
import packageJson from "../../package.json";

declare module "zod" {
	interface ZodType{
		accelerator?: ZodAcceleratorParser<this>;
	}
}

declare module "@duplojs/duplojs" {
	interface Plugins {
		"@duplojs/zod-accelerator": {version: string}
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

	public static duplojs(
		instance: DuploInstance<DuploConfig>, 
		params: Partial<
			Record<
				DuploConfig["environment"], 
				boolean
			>
		> = {DEV: false, PROD: true}
	){
		const environment = instance.config.environment;

		if(!params[environment]){
			return;
		}

		instance.plugins["@duplojs/zod-accelerator"] = {version: packageJson.version};

		const duploseHandler = (duplose: Route | Process | AbstractRoute) => {
			if(Object.keys(duplose.extracted).length === 0){
				return;
			}
			
			Object.entries(duplose.extracted).forEach(([key, value]) => {
				if(!value){
					return;
				}
				
				if(value instanceof zod.ZodType){
					ZodAccelerator.build(value);
				}
				else {
					Object.entries(value).forEach(([key, deepValue]) => {
						ZodAccelerator.build(deepValue);
					});
				}
			});
			
			duploExtends(duplose, {
				ZodAcceleratorError,
			});

			duploInject(duplose, ({}, d) => {
				d.stringDuploseFunction = d.stringDuploseFunction.replace(
					/\.parse\(request/g, 
					".accelerator.parse(request"
				);				
				d.stringDuploseFunction = d.stringDuploseFunction.replace(
					/error instanceof this\.ZodError/, 
					"error instanceof this.extensions.ZodAcceleratorError"
				);
			});
		};

		instance.addHook("onDeclareRoute", duploseHandler);
		instance.addHook("onDeclareAbstractRoute", (abstractRoute) => {
			if(abstractRoute instanceof AbstractRoute){
				duploseHandler(abstractRoute);
			}
		});
		instance.addHook("onCreateProcess", duploseHandler);
	}
}
