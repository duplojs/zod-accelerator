import type * as zod from "zod";
import { ZodAcceleratorError } from "./error";
import type { PromiseOrNot } from "@utils/types";

export type AcceleratorSafeParseError<
	Output extends any,
> =
	| {
		success: true;
		data: Output;
	}
	| {
		success: false;
		error: ZodAcceleratorError;
	};

export class ZodAcceleratorParser<
	_zodSchema extends zod.ZodType = zod.ZodType,
	_output extends _zodSchema["_output"] = _zodSchema["_output"],
> {
	public get isAsync() {
		return this.buidledParse.constructor.name === "AsyncFunction";
	}

	public constructor(
		private buidledParse: (input: unknown) => PromiseOrNot<AcceleratorSafeParseError<_output>>,
	) { }

	public safeParse(input: unknown): AcceleratorSafeParseError<_output> {
		const result = this.buidledParse(input);

		if (result instanceof Promise) {
			return {
				success: false,
				error: new ZodAcceleratorError(".", "Parse function is async."),
			};
		}

		return result;
	}

	public async safeParseAsync(input: unknown): Promise<AcceleratorSafeParseError<_output>> {
		return this.buidledParse(input);
	}

	public parse(input: unknown): _output {
		const result = this.safeParse(input);
		if (result.success) {
			return result.data;
		} else {
			throw result.error;
		}
	}

	public async parseAsync(input: unknown): Promise<_output> {
		const result = await this.buidledParse(input);
		if (result.success) {
			return result.data;
		} else {
			throw result.error;
		}
	}
}
