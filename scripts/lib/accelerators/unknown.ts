import * as zod from "zod";
import {ZodAnyAccelerator} from "./any";
import {ZodAccelerator} from "../accelerator";

@ZodAccelerator.autoInstance
export class ZodUnknownAccelerator extends ZodAnyAccelerator{
	public get support(): any{
		return zod.ZodUnknown;
	}
}
