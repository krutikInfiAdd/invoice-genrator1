import * as pdfjs from "pdfjs-dist"

// Required for pdf.js in browser
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";


/**
 * Load PDF using pdf.js
 * Used for:
 * - page count
 * - text extraction
 */
export async function loadPdf(file: File) {
    return pdfjs.getDocument(await file.arrayBuffer()).promise
}

/**
 * Safe page renderer that cancels previous render
 * Prevents:
 * "Cannot use the same canvas during multiple render() operations"
 */
export async function renderPageSafe(
    pdf: any,
    pageNumber: number,
    canvas: HTMLCanvasElement,
    scale: number,
    prevTaskRef?: { current?: any }
) {
    // Cancel previous render if exists
    if (prevTaskRef?.current) {
        try {
            prevTaskRef.current.cancel()
        } catch {
            /* ignore */
        }
    }

    const page = await pdf.getPage(pageNumber)
    const viewport = page.getViewport({ scale })

    const context = canvas.getContext("2d")!
    canvas.width = viewport.width
    canvas.height = viewport.height

    const renderTask = page.render({
        canvasContext: context,
        viewport,
    })

    if (prevTaskRef) {
        prevTaskRef.current = renderTask
    }

    await renderTask.promise
}
