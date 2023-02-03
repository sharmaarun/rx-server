import { resolve } from "path"
import { getPlugins } from "./index"
describe('Plugin helpers ', () => {
    it("should load all plugins", async () => {
        const pluginsPath = resolve(__dirname, "../../test-helpers/config", "plugins.ts")
        const { plugins } = await getPlugins(pluginsPath)
        expect(plugins?.length).toBeGreaterThan(0)

    })
})