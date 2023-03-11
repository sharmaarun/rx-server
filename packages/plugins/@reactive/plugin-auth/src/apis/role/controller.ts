import { BaseError } from "@reactive/commons";
import { createControllers, createCoreControllers } from "@reactive/server";

export default createControllers("role", ctx => ({
    async delete(req) {
        const existing = await ctx.query("role").findOne(req.query)
        if (!existing) throw new BaseError(`No such role exists`)
        if (existing.isCore) throw new BaseError(`Can't delete reserved roles`)
        const count = await ctx.query("role").delete(req.query)
        return req.send({ count })
    }
}))