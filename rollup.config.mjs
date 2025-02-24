import typescript from '@rollup/plugin-typescript';
import { defineConfig } from "rollup";

export default defineConfig({
	input: "scripts/index.ts",
	output: [
		{
			file: "dist/index.cjs",
			format: "cjs",
		},
		{
			file: "dist/index.mjs",
			format: "esm",
		},
	],
	plugins: [
		typescript({
			tsconfig: "tsconfig.build.json",
			include: /\.[jt]sx?$/,
			exclude: /node_modules/,
		}),
	],
});
