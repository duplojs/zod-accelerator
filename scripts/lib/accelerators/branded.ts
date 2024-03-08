import * as zod from "zod";
import {ZodAnyAccelerator} from "./any";

export class ZodBrandedAccelerator extends ZodAnyAccelerator{
	public get support(): any{
		return zod.ZodBranded;
	}

	static {
		new ZodBrandedAccelerator();
	}
}
