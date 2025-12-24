import {CROP_CONFIG, type MeeshoLayout, type Vendor} from "../pdf-cropper/config/cropConfig";


export default function CropOverlay({
                                        vendor,
                                        layout,
                                    }: {
    vendor: Vendor
    layout: MeeshoLayout
}) {
    let box

    if (vendor === "flipkart") {
        box = CROP_CONFIG.flipkart
    } else {
        box =
            layout === "fast"
                ? {
                    lowerLeft: CROP_CONFIG.meesho.fastLowerLeft,
                    upperRight: CROP_CONFIG.meesho.upperRight,
                }
                : {
                    lowerLeft: CROP_CONFIG.meesho.normalLowerLeft,
                    upperRight: CROP_CONFIG.meesho.upperRight,
                }
    }

    return (
        <div
            className="absolute border-2 border-red-500 bg-red-500/10 pointer-events-none"
            style={{
                left: box.lowerLeft.x,
                bottom: box.lowerLeft.y,
                width: box.upperRight.x - box.lowerLeft.x,
                height: box.upperRight.y - box.lowerLeft.y,
            }}
        />
    )
}
