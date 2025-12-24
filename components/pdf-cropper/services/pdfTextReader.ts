import * as pdfjs from "pdfjs-dist"


// REQUIRED for pdf.js to work in browser
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
/**
 * Extracts visible text from a specific PDF page
 * @param pdf pdf.js document instance
 * @param pageNumber 1-based page number
 */
export async function extractPageText(
    pdf: any,
    pageNumber: number
): Promise<string> {
    const page = await pdf.getPage(pageNumber)
    const textContent = await page.getTextContent()

    // Join all text items into one string
    return textContent.items
        .map((item: any) => item.str)
        .join(" ")
}
