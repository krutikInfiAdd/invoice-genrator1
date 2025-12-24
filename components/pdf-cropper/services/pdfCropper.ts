import { PDFDocument } from "pdf-lib"
import { loadPdf } from "./pdfViewer"
import { extractSkuFromText } from "../utils/extractSku"
import { CROP_CONFIG, type Vendor, type MeeshoLayout } from "../config/cropConfig"
import { extractPageText } from "./pdfTextReader.ts";
import { Bytes } from "firebase/firestore";

export async function cropAndMergeBySku(
    files: File[],
    vendor: Vendor,
    layout: MeeshoLayout,
    groupBySku: boolean
): Promise<Map<string, Blob>> {

    // sku -> output pdf
    const result = new Map<string, PDFDocument>()

    for (const file of files) {
        // 1️⃣ Load PDF twice (required)
        const pdfJsDoc = await loadPdf(file) // for TEXT
        const pdfLibDoc = await PDFDocument.load(
            await file.arrayBuffer()
        ) // for CROP

        const pages = pdfLibDoc.getPages()

        // 2️⃣ PAGE LOOP (THIS IS THE IMPORTANT PART)
        for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
            const page = pages[pageIndex]

            // ----------------------------------------
            // 🔥 PUT YOUR LINES EXACTLY HERE
            // ----------------------------------------
            let sku = "NO_SKU"

            if (groupBySku) {
                const text = await extractPageText(
                    pdfJsDoc,
                    pageIndex + 1 // pdf.js pages are 1-based
                )

                sku = extractSkuFromText(text) || "NO_SKU"
            }
            // ----------------------------------------
            // 🔥 SKU IS READY HERE
            // ----------------------------------------

            // 3️⃣ Create output PDF for this SKU (if not exists)
            if (!result.has(sku)) {
                result.set(sku, await PDFDocument.create())
            }

            const outPdf = result.get(sku)!

            // 4️⃣ Copy current page
            const [copiedPage] = await outPdf.copyPages(
                pdfLibDoc,
                [pageIndex]
            )

            // 5️⃣ Apply crop
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

            copiedPage.setCropBox(
                ll.x,
                ll.y,
                ur.x - ll.x,
                ur.y - ll.y
            )
            copiedPage.setMediaBox(
                ll.x,
                ll.y,
                ur.x - ll.x,
                ur.y - ll.y
            )

            // 6️⃣ Add page to SKU PDF
            outPdf.addPage(copiedPage)
        }
    }

    // 7️⃣ Convert PDFs to blobs
    const output = new Map<string, Blob>()

    for (const [sku, pdf] of result.entries()) {
        const bytes: Uint8Array = await pdf.save()
        // Explicitly convert to ArrayBuffer
        output.set(
            sku,
            new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" })
        )
    }
    return output
}
