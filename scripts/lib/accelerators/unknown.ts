import * as zod from "zod";
import {ZodAnyAccelerator} from "./any";

export class ZodUnknownAccelerator extends ZodAnyAccelerator{
	public get support(): any{
		return zod.ZodUnknown;
	}

	static {
		new ZodUnknownAccelerator();
	}
}
