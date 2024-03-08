import * as zod from "zod";
import {ZodUndefinedAccelerator} from "./undefined";

export class ZodVoidAccelerator extends ZodUndefinedAccelerator{
	public get support(): any{
		return zod.ZodVoid;
	}

	static {
		new ZodVoidAccelerator();
	}
}
