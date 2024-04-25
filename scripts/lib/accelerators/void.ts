import * as zod from "zod";
import {ZodUndefinedAccelerator} from "./undefined";
import {ZodAccelerator} from "../accelerator";

@ZodAccelerator.autoInstance
export class ZodVoidAccelerator extends ZodUndefinedAccelerator{
	public get support(): any{
		return ZodAccelerator.zod.ZodVoid;
	}
}
