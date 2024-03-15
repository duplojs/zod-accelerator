import * as zod from "zod";
import {ZodAccelerator} from "../accelerator";
import {ZodAcceleratorContent} from "../content";

@ZodAccelerator.autoInstance
export class ZodStringAccelerator extends ZodAccelerator{
	public get support(){
		return zod.ZodString;
	}

	public makeAcceleratorContent(zodSchema: zod.ZodString, zac: ZodAcceleratorContent){
		const def = zodSchema._def;

		zac.addContent(
			def.coerce
				? ZodStringAccelerator.stringPart.coerce()
				: ZodStringAccelerator.stringPart.typeof(),
			...def.checks.map(
				check => ZodStringAccelerator.stringPart[check.kind]?.(check as any)
			)
		);

		return zac;
	}

	static stringPart = {
		coerce: () => ({
			content: /* js */`
                $input = new String($input).valueOf();
            `
		}),
		typeof: () => ({
			if: /* js */"(typeof $input !== \"string\")",
			message: "Input is not a String.",
		}),
		min: ({value}: {value: number}) => ({
			if: /* js */`$input.length < ${value}`,
			message: `Input String has length less than ${value}.`,
		}),
		max: ({value}: {value: number}) => ({
			if: /* js */`$input.length > ${value}`,
			message: `Input String has length more than ${value}.`,
		}),
		length: ({value}: {value: number}) => ({
			if: /* js */`$input.length !== ${value}`,
			message: `Input String has length not equal to ${value}.`,
		}),
		email: () => ({
			if: /* js */"!this.duploj$RegexEmail.test($input)",
			message: "Input string is not an Email.",
			ctx: {duploj$RegexEmail: /^(?!\.)(?!.*\.\.)([A-Z0-9_+-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i}
		}),
		url: () => `
            try {
                new URL($input);
            } catch (error) {
                return {success: false, error: new ZodAcceleratorError(\`$path\`, "Input String is not an url.")};
            }
        `,
		emoji: () => ({
			if: /* js */"!this.duploj$RegexEmoji.test($input)",
			message: "Input String is not an emoji.",
			ctx: {duploj$RegexEmoji: /^(\p{Extended_Pictographic}|\p{Emoji_Component})+$/u}
		}),
		uuid: () => ({
			if: /* js */"!this.duploj$RegexUuid.test($input)",
			message: "Input String is not an uuid.",
			ctx: {duploj$RegexUuid: /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i}
		}),
		cuid: () => ({
			if: /* js */"!this.duploj$RegexCuid.test($input)",
			message: "Input String is not an cuid.",
			ctx: {duploj$RegexCuid: /^c[^\s-]{8,}$/i}
		}),
		includes: ({value, position}: {value: string, position?: number}) => ({
			if: /* js */`!$input.includes("${value}", ${position ?? ""})`,
			message: `Input String not includes ${value}.`,
		}),
		cuid2: () => ({
			if: /* js */"!this.duploj$RegexCuid2.test($input)",
			message: "Input String is not an cuid2.",
			ctx: {duploj$RegexCuid2: /^[a-z][a-z0-9]*$/}
		}),
		ulid: () => ({
			if: /* js */"!this.duploj$RegexUlid.test($input)",
			message: "Input String is not an ulid.",
			ctx: {duploj$RegexUlid: /^[0-9A-HJKMNP-TV-Z]{26}$/}
		}),
		startsWith: ({value}: {value: string}) => ({
			if: /* js */`!$input.startsWith("${value}")`,
			message: `Input String not starts with ${value}.`
		}),
		endsWith: ({value}: {value: string}) => ({
			if: /* js */`!$input.endsWith("${value}")`,
			message: `Input String not ends with ${value}.`
		}),
		regex: ({regex}: {regex: RegExp}) => ({
			if: /* js */"!$this.regexCustom.test($input)",
			message: `Input String not match with regex ${regex.source}.`,
			ctx: {regexCustom: regex}
		}),
		trim: () => /* js */`
            $input = $input.trim();
        `,
		toUpperCase: () => /* js */`
            $input = $input.toUpperCase();
        `,
		toLowerCase: () => /* js */`
            $input = $input.toLowerCase();
        `,
		datetime: ({precision, offset}: { precision: number | null; offset: boolean }) => {
			const ctx: Record<keyof any, any> = {};

			if(precision){
				if(offset){
					ctx.regexDatetime = eval(`/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{${precision}}(([+-]\\d{2}(:?\\d{2})?)|Z)$/`);
				} 
				else {
					ctx.regexDatetime = eval(`/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{${precision}}Z$/`);
				}
			} 
			else if(precision === 0){
				if(offset){
					ctx.regexDatetime = eval("/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(([+-]\\d{2}(:?\\d{2})?)|Z)$/");
				} 
				else {
					ctx.regexDatetime = eval("/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$/");
				}
			} 
			else {
				if(offset){
					ctx.regexDatetime = eval("/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(([+-]\\d{2}(:?\\d{2})?)|Z)$/");
				} 
				else {
					ctx.regexDatetime = eval("/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?Z$/");
				}
			}

			return {
				if: /* js */"!$this.regexDatetime.test($input)",
				message: "Input String is not a datetime.",
				ctx,
			};
		},
		ip: ({version}: {version?: string}) => {
			if(version === "v4"){
				return {
					if: /* js */"!this.duploj$RegexIpv4.test($input)",
					message: "Input String is not an ipv4.",
					ctx: {duploj$RegexIpv4: /^(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))$/},
				};
			}
			else if(version === "v6"){
				return {
					if: /* js */"!this.duploj$RegexIpv6.test($input)",
					message: "Input String is not an ipv6.",
					ctx: {
						duploj$RegexIpv6: /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/
					},
				};
			}
			else {
				return {
					if: /* js */"!this.duploj$RegexIpv4.test($input) && !this.duploj$RegexIpv6.test($input)",
					message: "Input String is not an ipv4 or ipv6.",
					ctx: {
						duploj$RegexIpv4: /^(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))$/,
						duploj$RegexIpv6: /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/
					},
				};
			}
		},
	};
}
