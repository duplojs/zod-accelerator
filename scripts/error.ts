import { ZodError, type ZodIssue } from "zod";

export class ZodAcceleratorError extends ZodError {
	public constructor(
		public passedPath: string,
		public passedMessage: string,
		issue?: ZodIssue,
	) {
		super([
			{
				code: "custom",
				message: `${passedPath} : ${passedMessage}`,
				path: passedPath === "."
					? []
					: passedPath.substring(1).split("."),
				...issue,
			},
		]);
	}
}
