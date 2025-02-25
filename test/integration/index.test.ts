import * as allExport from "@duplojs/zod-accelerator";

it("export all", () => {
	expect(Object.keys(allExport))
		.toEqual([
			"ZodAccelerator",
			"ZodAcceleratorContent",
			"ZodAcceleratorError",
			"ZodAcceleratorParser",
			"default",
			"zodSchemaIsAsync",
		]);
});
