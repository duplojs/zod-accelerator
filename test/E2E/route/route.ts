import Duplo, {zod} from "@duplojs/duplojs";
import {parentPort} from "worker_threads";
import duploZodAccelerator from "../../../scripts/duplo";

const duplo = Duplo({port: 1506, host: "localhost", environment: "DEV"});

duplo.use(duploZodAccelerator, {DEV: true});

duplo.declareRoute("GET", "/test/1")
.extract({
	query: {
		test: zod.coerce.number()
	}
})
.handler(({pickup}, res) => {
	res.code(200).info("s").send(pickup("test"));
});

duplo.declareRoute("POST", "/test/2")
.extract({
	body: zod.object({
		test1: zod.string()
	}).passthrough()
})
.handler(({pickup}, res) => {
	res.code(200).info("s").send(pickup("body"));
});

duplo.launch(() => parentPort?.postMessage("ready"));
