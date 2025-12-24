import React, { useEffect, useRef, useState } from "react"
import { loadPdf } from "./services/pdfViewer"
import PdfCanvasPage from "./PdfCanvasPage"
import { type Vendor, type MeeshoLayout } from "./config/cropConfig"
import { formatFileSize } from "./utils/format"

interface PdfItem {
    id: string
    file: File
    name: string
    pdf: any
    pageCount: number
}

interface PdfWorkspaceProps {
    files: File[]
    vendor: Vendor
    layout: MeeshoLayout
    zoom: number          // ✅ ADD
    showCrop: boolean     // ✅ ADD
}

export default function PdfWorkspace({
    files,
    vendor,
    layout,
    zoom,
    showCrop,
}: PdfWorkspaceProps) {
    const [items, setItems] = useState<PdfItem[]>([])
    const containerRef = useRef<HTMLDivElement>(null)

    // Load PDFs
    useEffect(() => {
        let cancelled = false

        async function load() {
            const loaded: PdfItem[] = []

            for (const file of files) {
                const pdf = await loadPdf(file)
                if (cancelled) return

                loaded.push({
                    id: crypto.randomUUID(),
                    file,
                    name: file.name.replace(/\.pdf$/i, ""),
                    pdf,
                    pageCount: pdf.numPages,
                })
            }

            setItems(loaded)
        }

        load()
        return () => {
            cancelled = true
        }
    }, [files])

    return (
        <div
            ref={containerRef}
            className="h-[75vh] overflow-y-auto space-y-6"
        >
            {items.map((item) => (
                <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-soft p-4"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                        <input
                            value={item.name}
                            onChange={(e) => {
                                setItems((prev) =>
                                    prev.map((p) =>
                                        p.id === item.id
                                            ? { ...p, name: e.target.value }
                                            : p
                                    )
                                )
                            }}
                            className="font-medium text-sm border-b focus:outline-none"
                        />

                        <div className="flex gap-2 text-xs">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100">
                                {item.pageCount} pages
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-100">
                                {formatFileSize(item.file.size)}
                            </span>
                        </div>
                    </div>

                    {/* Pages */}
                    <div className="space-y-6">
                        {Array.from({ length: item.pageCount }).map(
                            (_, pageIndex) => (
                                <PdfCanvasPage
                                    key={pageIndex}
                                    pdf={item.pdf}
                                    pageNumber={pageIndex + 1}
                                    vendor={vendor}
                                    layout={layout}
                                    zoom={zoom}
                                    showCrop={showCrop}
                                />
                            )
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}
