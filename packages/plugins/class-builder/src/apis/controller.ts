import { createControllers } from "@reactive/server";

export default createControllers("class-builder", ctx => ({
    test() {
        return "OK"
    }
}))