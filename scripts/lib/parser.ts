import * as zod from "zod";
import {ZodAcceleratorError} from "./error";
import {PromiseOrNot} from "@duplojs/duplojs";

export type AcceleratorSafeParseError<_output extends any> = 
    { success: true, data: _output } 
    | { success: false, error: ZodAcceleratorError }

export class ZodAcceleratorParser<
    _zodSchema extends zod.ZodType,
    _output extends _zodSchema["_output"] = _zodSchema["_output"]
>{
	constructor(
        private buidledParse: (input: unknown) => PromiseOrNot<AcceleratorSafeParseError<_output>>
	){}

	safeParse(input: unknown): AcceleratorSafeParseError<_output>
	{
		const result = this.buidledParse(input);

		if(result instanceof Promise){
			return {
				success: false,
				error: new ZodAcceleratorError(".", "Parse function is async.")
			};
		}

		return result;
	}

	async safeParseAsync(input: unknown): Promise<AcceleratorSafeParseError<_output>>
	{
		return await this.buidledParse(input); 
	}

	parse(input: unknown): _output
	{
		const result = this.safeParse(input);
		if(result.success){
			return result.data;
		}
		else {
			throw result.error;
		}
	}

	async parseAsync(input: unknown): Promise<_output>
	{
		const result = await this.buidledParse(input);
		if(result.success){
			return result.data;
		}
		else {
			throw result.error;
		}
	}
}
