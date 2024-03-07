import {defineConfig} from "rollup";
import esbuild from "rollup-plugin-esbuild";
import json from "@rollup/plugin-json";

export default defineConfig([
	{
		input: "scripts/index.ts",
		output: [
			{
				file: "dist/index.mjs",
				format: "esm"
			},
			{
				file: "dist/index.cjs",
				format: "cjs",
			}
		],
		plugins: [
			esbuild({
				include: /\.[jt]sx?$/,
				exclude: /node_modules/,
				tsconfig: "tsconfig.json",
			}),
			json(),
		]
	},
]);
