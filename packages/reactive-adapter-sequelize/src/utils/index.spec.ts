import { extractNameFromSquelizeInstance } from "./index"

describe('Sequelize adapter utils', () => {
    it("Should return the name from string rep of sequelize model", () => {
        expect(extractNameFromSquelizeInstance("[obj sql:asd]")).toBe("asd")
        expect(extractNameFromSquelizeInstance("[obj sqlasd]")).toBeUndefined()
    })
})