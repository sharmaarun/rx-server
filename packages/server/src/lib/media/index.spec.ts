import { MediaManager } from "../media"

describe('Media Manager', () => {

    let media = new MediaManager()

    beforeAll(async () => {
        await media.init({
            config: {
                media: {}
            }
        } as any)
    })

    it("should upload/create image", () => {
        
    })
})