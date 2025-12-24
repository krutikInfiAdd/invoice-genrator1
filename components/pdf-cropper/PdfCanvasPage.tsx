import { useEffect, useRef, useState } from "react"
import { renderPageSafe } from "./services/pdfViewer"
import { CROP_CONFIG, type Vendor,type MeeshoLayout } from "./config/cropConfig"

interface Props {
    pdf: any
    pageNumber: number
    vendor: Vendor
    layout: MeeshoLayout
    zoom: number
    showCrop: boolean
}

export default function PdfCanvasPage({
                                          pdf,
                                          pageNumber,
                                          vendor,
                                          layout,
                                          zoom,
                                          showCrop,
                                      }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    // 🔐 render control refs
    const renderTaskRef = useRef<any>(null)
    const isRenderingRef = useRef(false)
    const lastKeyRef = useRef<string>("")

    const [overlay, setOverlay] = useState<{
        x: number
        y: number
        w: number
        h: number
    } | null>(null)

    useEffect(() => {
        if (!pdf || !canvasRef.current) return

        const renderKey = `${pageNumber}-${zoom}-${vendor}-${layout}`

        // 🚫 Prevent duplicate renders (StrictMode)
        if (lastKeyRef.current === renderKey) {
            return
        }
        lastKeyRef.current = renderKey

        let cancelled = false

        async function draw() {
            // 🚫 Do not start another render if one is in progress
            if (isRenderingRef.current) return
            isRenderingRef.current = true

            try {
                await renderPageSafe(
                    pdf,
                    pageNumber,
                    canvasRef.current!,
                    zoom,
                    renderTaskRef
                )

                if (cancelled) return

                // ---- overlay calculation AFTER render ----
                const page = await pdf.getPage(pageNumber)
                const pdfWidth = page.view[2]
                const pdfHeight = page.view[3]

                const canvas = canvasRef.current!
                const scaleX = canvas.width / pdfWidth
                const scaleY = canvas.height / pdfHeight

                let ll, ur
                if (vendor === "flipkart") {
                    ll = CROP_CONFIG.flipkart.lowerLeft
                    ur = CROP_CONFIG.flipkart.upperRight
                } else {
                    ll =
                        layout === "fast"
                            ? CROP_CONFIG.meesho.fastLowerLeft
                            : CROP_CONFIG.meesho.normalLowerLeft
                    ur = CROP_CONFIG.meesho.upperRight
                }

                setOverlay({
                    x: ll.x * scaleX,
                    y: (pdfHeight - ur.y) * scaleY,
                    w: (ur.x - ll.x) * scaleX,
                    h: (ur.y - ll.y) * scaleY,
                })
            } catch (e) {
                if ((e as any)?.name !== "RenderingCancelledException") {
                    console.error(e)
                }
            } finally {
                isRenderingRef.current = false
            }
        }

        draw()

        return () => {
            cancelled = true
            if (renderTaskRef.current) {
                try {
                    renderTaskRef.current.cancel()
                } catch {}
            }
        }
    }, [pdf, pageNumber, zoom, vendor, layout])

    return (
        <div className="relative inline-block">
            <canvas
                ref={canvasRef}
                className="border rounded bg-white shadow relative z-10"
            />

            {showCrop && overlay && (
                <div
                    className="absolute z-20 border-2 border-red-500 bg-red-500/20 pointer-events-none"
                    style={{
                        left: overlay.x,
                        top: overlay.y,
                        width: overlay.w,
                        height: overlay.h,
                    }}
                />
            )}
        </div>
    )
}
