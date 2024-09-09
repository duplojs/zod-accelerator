import duploLint from "@duplojs/eslint";

export default [
	{
		...duploLint,
		languageOptions: {
			...duploLint.languageOptions,
			globals: {
				vi: true,
				describe: true,
				it: true,
				expect: true,
				beforeEach: true,
				afterEach: true,
				beforeAll: true,
				afterAll: true,
			},
		},
		rules: {
			...duploLint.rules,
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": "off",
			"@typescript-eslint/no-magic-numbers": "off",
			"@typescript-eslint/no-unnecessary-type-parameters": "off",
			"func-style": "off",
			"@typescript-eslint/no-unsafe-member-access": "off",
			"@typescript-eslint/no-unsafe-argument": "off",
		},
		files: ["**/*.test.ts", "test/**/*.ts"],
		ignores: ["**/*.d.ts"]
	},
	{
		...duploLint,
		rules: {
			...duploLint.rules,
			"new-cap": "off",
		},
		files: ["**/*.ts"],
		ignores: ["**/*.test.ts", "test/**/*.ts", "**/*.d.ts"],
	},
];
