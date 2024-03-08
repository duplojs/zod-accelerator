export class ZodAcceleratorError extends Error{
	constructor(
		public path: string, 
		message: string
	){
		super(`${path || "."} : ${message}`);

		throw this;
	}
}
