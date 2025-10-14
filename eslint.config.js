import {duplojsEslintOpen, duplojsEslintTest} from "@duplojs/eslint";

export default [
	{
		...duplojsEslintTest,
		languageOptions: {
			...duplojsEslintTest.languageOptions,
			parserOptions: {
				...duplojsEslintTest.languageOptions.parserOptions,
				projectService: true,
			},
		},
		files: ["**/*.test.ts", "test/**/*.ts"],
		ignores: ["**/*.d.ts"]
	},
	{
		...duplojsEslintOpen,
		languageOptions: {
			...duplojsEslintOpen.languageOptions,
			parserOptions: {
				...duplojsEslintOpen.languageOptions.parserOptions,
				projectService: true,
			},
		},
		files: ["**/*.ts"],
		ignores: ["**/*.test.ts", "test/**/*.ts", "**/*.d.ts"],
	},
	{
		ignores: ["coverage", "dist"]
	}
];
