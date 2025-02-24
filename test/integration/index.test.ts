import * as allExport from "@duplojs/zod-accelerator";

it("export all", () => {
	expect(Object.keys(allExport))
		.toEqual([
			"ZodAccelerator",
			"ZodAcceleratorError",
			"ZodAcceleratorParser",
			"default",
			"zodSchemaIsAsync",
		]);
});
