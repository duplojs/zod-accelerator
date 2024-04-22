import * as zod from "zod";
import {AbstractRoute, DuploConfig, DuploInstance, Process, Route} from "@duplojs/duplojs";
import {duploExtends, duploInject} from "@duplojs/editor-tools";
import packageJson from "../package.json";
import {ZodAccelerator} from ".";
import {ZodAcceleratorError} from "./lib/error";

export * from "./lib/accelerator";
export * from "./lib/error";
export * from "./lib/parser";

declare module "@duplojs/duplojs" {
	interface Plugins {
		"@duplojs/zod-accelerator": {version: string}
	}
}

export default function duploZodAccelerator(
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
