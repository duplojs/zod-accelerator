// https://github.dev/colinhacks/zod

import "./accelerators/string";
import "./accelerators/number";
import "./accelerators/object";
import "./accelerators/array";
import "./accelerators/enum";
import "./accelerators/boolean";
import "./accelerators/nullable";
import "./accelerators/date";
import "./accelerators/symbol";
import "./accelerators/undefined";
import "./accelerators/null";
import "./accelerators/any";
import "./accelerators/unknown";
import "./accelerators/never";
import "./accelerators/void";
import "./accelerators/union";
import "./accelerators/intersection";
import "./accelerators/tuple";
import "./accelerators/default";
import "./accelerators/branded";
import "./accelerators/nan";
import "./accelerators/optional";
import "./accelerators/catch";
import "./accelerators/record";
import "./accelerators/literal";
import "./accelerators/readonly";
import "./accelerators/bigInt";
import "./accelerators/effects";
import "./accelerators/lazy";

export * from "./accelerator";
export * from "./error";
export * from "./parser";

export { ZodAccelerator as default } from "./accelerator";
