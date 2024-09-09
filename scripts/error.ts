export class ZodAcceleratorError extends Error {
	public constructor(
		path: string,
		message: string,
	) {
		super(`${path || "."} : ${message}`);
	}
}
