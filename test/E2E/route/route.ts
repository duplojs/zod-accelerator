import Duplo, {zod} from "@duplojs/duplojs";
import {parentPort} from "worker_threads";
import {ZodAccelerator} from "../../../scripts";

const duplo = Duplo({port: 1506, host: "localhost", environment: "DEV"});

duplo.use(ZodAccelerator.duplojs, {DEV: true});

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
	})
})
.handler(({pickup}, res) => {
	res.code(200).info("s").send(pickup("body"));
});

duplo.launch(() => parentPort?.postMessage("ready"));
