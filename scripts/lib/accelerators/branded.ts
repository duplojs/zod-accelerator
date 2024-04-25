import * as zod from "zod";
import {ZodAnyAccelerator} from "./any";
import {ZodAccelerator} from "../accelerator";

@ZodAccelerator.autoInstance
export class ZodBrandedAccelerator extends ZodAnyAccelerator{
	public get support(): any{
		return ZodAccelerator.zod.ZodBranded;
	}
}
