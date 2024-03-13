import * as zod from "zod";
import {ZodAcceleratorError} from "./error";

export type AcceleratorSafeParseError<_output extends any> = 
    { success: true, data: _output } 
    | { success: false, error: ZodAcceleratorError }

export class ZodAcceleratorParser<
    _zodSchema extends zod.ZodType,
    _output extends any = _zodSchema["_output"]
>{
	constructor(
        public parse: (input: unknown) => _output
	){}

	parseAsync(input: unknown){
		return this.parse(input) as Promise<_output>;
	}

	safeParse(input: unknown): AcceleratorSafeParseError<_output>
	{
		try {
			return {
				success: true,
				data: this.parse(input),
			};
		} catch (error: any){
			return {
				success: false,
				error
			};
		}
	}

	async safeParseAsync(input: unknown): Promise<AcceleratorSafeParseError<_output>>
	{
		try {
			return {
				success: true,
				data: await this.parseAsync(input),
			};
		} catch (error: any){
			return {
				success: false,
				error
			};
		}
	}
}
