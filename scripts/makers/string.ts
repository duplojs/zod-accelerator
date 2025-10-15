import { A, type AnyFunction, innerPipe, O, P, pipe } from "@duplojs/utils";
import { AccelerateValue } from "@scripts/accelerateValue";
import { type ZodTypeUnion } from "@scripts/types";
import * as zodCore from "zod/v4/core";

type ParticularZodStringFormats =
	| "uuid"
	| "url"
	| "includes"
	| "regex"
	| "datetime"
	| "ends_with"
	| "starts_with"
	| "jwt"
	| "time";

function createFormatCheck(regex: RegExp) {
	return (input: string) => regex.test(input) && input;
}

const uuidMapper = {
	v1: 1,
	v2: 2,
	v3: 3,
	v4: 4,
	v5: 5,
	v6: 6,
	v7: 7,
	v8: 8,
} satisfies Record<Exclude<zodCore.$ZodUUIDDef["version"], undefined>, number>;

const stringCheck = {
	base64: (input: string) => zodCore.isValidBase64(input) && input,
	base64url: (input: string) => zodCore.isValidBase64URL(input) && input,
	email: createFormatCheck(zodCore.regexes.email),
	cuid: createFormatCheck(zodCore.regexes.cuid),
	cuid2: createFormatCheck(zodCore.regexes.cuid2),
	ulid: createFormatCheck(zodCore.regexes.ulid),
	ipv6: createFormatCheck(zodCore.regexes.ipv6),
	ipv4: createFormatCheck(zodCore.regexes.ipv4),
	emoji: createFormatCheck(zodCore.regexes.emoji()),
	cidrv4: createFormatCheck(zodCore.regexes.cidrv4),
	cidrv6: createFormatCheck(zodCore.regexes.cidrv6),
	date: createFormatCheck(zodCore.regexes.date),
	duration: createFormatCheck(zodCore.regexes.duration),
	e164: createFormatCheck(zodCore.regexes.e164),
	guid: createFormatCheck(zodCore.regexes.guid),
	// eslint-disable-next-line camelcase
	json_string: (input: string) => {
		try {
			JSON.parse(input);
			return input;
		} catch {
			return false;
		}
	},
	ksuid: createFormatCheck(zodCore.regexes.ksuid),
	nanoid: createFormatCheck(zodCore.regexes.nanoid),
	xid: createFormatCheck(zodCore.regexes.xid),
	lowercase: createFormatCheck(zodCore.regexes.lowercase),
	uppercase: createFormatCheck(zodCore.regexes.uppercase),

	time: (def: zodCore.$ZodISOTimeDef) => {
		const regex = zodCore.regexes.time(def);

		return createFormatCheck(regex);
	},
	// eslint-disable-next-line camelcase
	starts_with: (startsString: string) => (input: string) => input.startsWith(startsString) && input,
	jwt: (def: zodCore.$ZodJWTDef) => {
		const alg = def.alg;
		return (input: string) => zodCore.isValidJWT(input, alg) && input;
	},
	// eslint-disable-next-line camelcase
	ends_with: (endsString: string) => (input: string) => input.endsWith(endsString) && input,
	datetime: (def: zodCore.$ZodISODateTimeDef) => {
		const regex = zodCore.regexes.datetime(def);
		return createFormatCheck(regex);
	},
	includes: (stringInclude: string) => (input: string) => input.includes(stringInclude) && input,
	regex: (regex: RegExp) => createFormatCheck(regex),
	uuid: (version?: zodCore.$ZodUUIDDef["version"]) => {
		const regex = zodCore.regexes.uuid(version && uuidMapper[version]);
		return createFormatCheck(regex);
	},
	url: (def: zodCore.$ZodURLDef) => {
		const { hostname, protocol, normalize } = def;

		return (input: string) => {
			try {
				const url = new URL(input);

				if (hostname) {
					hostname.lastIndex = 0;
					if (!hostname.test(url.hostname)) {
						return false;
					}
				}

				if (protocol) {
					protocol.lastIndex = 0;
					if (!protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol)) {
						return false;
					}
				}
				if (normalize) {
					return url.href;
				} else {
					return input;
				}
			} catch {
				return false;
			}
		};
	},
} satisfies (
	& Record<
		Exclude<zodCore.$ZodStringFormats, ParticularZodStringFormats>,
		AnyFunction<[input: string], string | false>
	>
	& Record<
		ParticularZodStringFormats,
		(value: any) => AnyFunction<[input: string], string | false>
	>
);

function convertCheckCustom<
	GenericT extends zodCore.$ZodCustomStringFormat | zodCore.$ZodCheckOverwrite,
>(zodCheckCustom: GenericT) {
	return (input: string) => {
		const payload = {
			issues: [],
			value: input,
		};

		const isAsync = zodCheckCustom._zod.check(payload);

		if (isAsync instanceof Promise) {
			return isAsync.then(() => payload.issues.length ? false : payload.value);
		}

		return payload.issues.length ? false : payload.value;
	};
}

function convertZodStringFormatToZodCheck(
	zodSchema: Extract<ZodTypeUnion, { type: "string" }>,
): zodCore.$ZodStringFormatChecks[] {
	if (zodSchema._zod.traits.has("$ZodCheck")) {
		return [zodSchema as never];
	}

	return [];
}

export const stringMaker = AccelerateValue.createMaker(
	O.discriminate("type", "string"),
	(zodSchema, { create }) => create(
		({ $input, $output, $stop, fromContext }) => {
			const check = pipe(
				[
					...convertZodStringFormatToZodCheck(zodSchema),
					...(zodSchema.def.checks ?? []) as (zodCore.$ZodStringFormatChecks | zodCore.$ZodCheckOverwrite)[],
				],
				A.map(
					innerPipe(
						innerPipe(
							P.when(
								O.deepDiscriminate("_zod.def.check", "overwrite"),
								convertCheckCustom,
							),
							P.when(
								O.deepDiscriminate("_zod.def.format", "time"),
								(check) => stringCheck.time(check._zod.def),
							),
							P.when(
								O.deepDiscriminate("_zod.def.format", "starts_with"),
								(check) => stringCheck.starts_with(check._zod.def.prefix),
							),
							P.when(
								O.deepDiscriminate("_zod.def.format", "jwt"),
								(check) => stringCheck.jwt(check._zod.def),
							),
							P.when(
								O.deepDiscriminate("_zod.def.format", "ends_with"),
								(check) => stringCheck.ends_with(check._zod.def.suffix),
							),
							P.when(
								O.deepDiscriminate("_zod.def.format", "datetime"),
								(check) => stringCheck.datetime(check._zod.def),
							),
							P.when(
								O.deepDiscriminate("_zod.def.format", "includes"),
								(check) => stringCheck.includes(check._zod.def.includes),
							),
							P.when(
								O.deepDiscriminate("_zod.def.format", "regex"),
								(check) => stringCheck.regex(check._zod.def.pattern),
							),
							P.when(
								O.deepDiscriminate("_zod.def.format", "uuid"),
								(check) => stringCheck.uuid(check._zod.def.version),
							),
						),
						innerPipe(
							P.when(
								O.deepDiscriminate("_zod.def.format", "url"),
								(check) => stringCheck.url(check._zod.def),
							),
							P.when(
								O.deepDiscriminate("_zod.def.format", [
									"base64",
									"base64url",
									"cidrv4",
									"cidrv6",
									"cuid",
									"cuid2",
									"date",
									"duration",
									"e164",
									"email",
									"emoji",
									"guid",
									"ulid",
									"ipv4",
									"ipv6",
									"ksuid",
									"lowercase",
									"nanoid",
									"uppercase",
									"xid",
								]),
								(check) => stringCheck[check._zod.def.format],
							),
							P.otherwise(convertCheckCustom),
						),
						(check) => `
							${$input} = ${fromContext(check)}(${$input});

							if(${$input} === ${fromContext(false)}){
								${$stop}
							}
						`,
					),
				),
			);

			return [
				zodSchema.def.coerce
					? `
					${$input} = String(${$input});
					`
					: "",
				`
				if(typeof ${$input} !== ${fromContext("string")}){
					${$stop}
				}
				`,
				...check,
				`let ${$output} = ${$input} `,
			];
		},
	),
);
