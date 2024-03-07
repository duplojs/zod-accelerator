import {defineConfig} from "vitest/config";

export default defineConfig({
	test: {
		watch: false,
		globals: true,
		include: ["test/**/*.test.ts"],
		coverage: {
			provider: "istanbul",
			reporter: [
				"text", "json", "html", "json-summary"
			],
			reportsDirectory: "coverage",
			include: ["scripts/lib/accelerators/**.ts"],
		}
	},
});
