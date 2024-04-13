export class ZodAcceleratorError extends Error{
	constructor(
		path: string,
		message: string
	){
		super(`${path || "."} : ${message}`);
	}
}
