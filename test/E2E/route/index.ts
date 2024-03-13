import {zod} from "@duplojs/duplojs";
import {workerTesting} from "@duplojs/worker-testing";

export default workerTesting(
	__dirname + "/route.ts",
	[
		{
			title: "valide query params",
			url: "http://localhost:1506/test/1",
			method: "GET",
			query: {
				test: "111"
			},
			response: {
				code: 200,
				info: "s",
				body: zod.literal("111")
			}
		},
		{
			title: "invalide query params",
			url: "http://localhost:1506/test/1",
			method: "GET",
			query: {
				test: "AA"
			},
			response: {
				code: 400,
				info: "TYPE_ERROR.query.test",
			}
		},
		{
			title: "valide body",
			url: "http://localhost:1506/test/2",
			method: "POST",
			headers: {
				"content-type": "application/json"
			},
			body: {
				test1: "eeeeee"
			},
			response: {
				code: 200,
				info: "s",
				body: zod.object({
					test1: zod.literal("eeeeee")
				})
			}
		},
		{
			title: "invalide body",
			url: "http://localhost:1506/test/2",
			method: "POST",
			headers: {
				"content-type": "application/json"
			},
			body: {
				data: {
					test1: 11
				}
			},
			response: {
				code: 400,
				info: "TYPE_ERROR.body",
			}
		},
	]
);
