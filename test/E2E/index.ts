import {workersTesting} from "@duplojs/worker-testing";

workersTesting(
	(path) => import(path),
	__dirname + "/route",
);
