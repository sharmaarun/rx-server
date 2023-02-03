import { createControllers } from "@reactive/server";

export default createControllers("admin", ctx => ({
    test() {
        return "OK"
    }
}))