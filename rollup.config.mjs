import {defineConfig} from "rollup";
import typescript from "@rollup/plugin-typescript";
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
			typescript({
				exclude: ["node_mudules"],
				tsconfig: "tsconfig.json",
				module: "ESNext",
			}),
			json(),
		]
	},
]);
