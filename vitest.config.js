import {defineConfig} from "vitest/config";
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	test: {
		watch: false,
		globals: true,
		include: [
			"scripts/**/*.test.ts", 
			"test/integration/**/*.test.ts", 
		],
		coverage: {
			provider: "istanbul",
			reporter: [
				"text", "json", "html", "json-summary"
			],
			reportsDirectory: "coverage",
			include: [
				"scripts/accelerators/**/**.ts", 
				"scripts/utils/**/**.ts"
			],
			exclude: [
				"**/*.test.ts", 
				"bin", 
				"dist",
			],
		}
	},
	plugins: [tsconfigPaths()],
});
