export type Vendor = "flipkart" | "meesho"
export type MeeshoLayout = "normal" | "fast"

export const CROP_CONFIG = {
    flipkart: {
        lowerLeft: { x: 165, y: 460 },
        upperRight: { x: 430, y: 820 },
    },

    meesho: {
        normalLowerLeft: { x: 0, y: 490 },
        fastLowerLeft: { x: 0, y: 470 },
        upperRight: { x: 595, y: 842 },
    },
} as const
