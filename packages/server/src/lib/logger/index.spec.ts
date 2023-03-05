import { Logger } from "./index"

describe('Server Logger', () => {
    const logger = new Logger()
    beforeAll(async () => {
        await logger.init()
    })
    it("should log", () => {
        logger.log("Test Log", "two")
    })
    it("should warn", () => {
        logger.warn("Test Log", "two")
    })
    it("should log", () => {
        logger.error("Test Log", "two")
    })
    it("should log", () => {
        logger.debug("Test Log", "two")
    })
    it("should log", () => {
        logger.success("Test Log", "two")
    })
})