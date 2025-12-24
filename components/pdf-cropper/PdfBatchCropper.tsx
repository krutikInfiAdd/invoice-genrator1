import { useState } from "react"
import PdfWorkspace from "./PdfWorkspace"
import PdfDropZone from "./PdfDropZone"
import PdfControls from "./PdfControls"

import type { Vendor, MeeshoLayout } from "./config/cropConfig"
import { cropAndMergeBySku } from "./services/pdfCropper"
import { AdBanner } from "../AdBanner"

export default function PdfBatchCropper() {
    // -------------------------
    // State
    // -------------------------
    const [vendor, setVendor] = useState<Vendor>("flipkart")
    const [layout, setLayout] = useState<MeeshoLayout>("normal")
    const [files, setFiles] = useState<File[]>([])
    const [zoom, setZoom] = useState(1.2)
    const [showCrop, setShowCrop] = useState(true)
    const [groupBySku, setGroupBySku] = useState(false)
    const [loading, setLoading] = useState(false)

    // -------------------------
    // File handling
    // -------------------------
    function handleAddFiles(newFiles: File[]) {
        setFiles((prev) => {
            const existing = new Set(
                prev.map((f) => `${f.name}_${f.size}`)
            )

            const filtered = newFiles.filter(
                (f) => !existing.has(`${f.name}_${f.size}`)
            )

            return [...prev, ...filtered]
        })
    }

    // -------------------------
    // Crop handler
    // -------------------------
    async function handleCrop() {
        if (!files.length) {
            alert("Please upload PDFs first")
            return
        }

        setLoading(true)
        try {
            /**
             * Always returns:
             * Map<string, Blob>
             *  - key = SKU or "NO_SKU"
             *  - value = cropped PDF blob
             */
            const result = await cropAndMergeBySku(
                files,
                vendor,
                layout,
                groupBySku
            )

            // Trigger downloads
            for (const [sku, blob] of result.entries()) {
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = `${sku}.pdf`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                URL.revokeObjectURL(url)
            }
        } catch (err) {
            console.error(err)
            alert("Failed to crop PDF")
        } finally {
            setLoading(false)
        }
    }

    // -------------------------
    // Render
    // -------------------------
    return (
            <div className="w-full">
                    <div className="my-6">
                                                <AdBanner />
                                              </div>
                <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 gap-4">
                        <h1 className="text-2xl font-semibold">
                            PDF Label Cropper
                        </h1>
                        <p className="text-sm text-slate-500">
                            Flipkart / Meesho bulk label cropping
                        </p>
                    </div>

                    {/* Controls */}
                    {/* <div className="bg-white rounded-xl shadow-soft p-4 grid grid-cols-1 md:grid-cols-6 gap-4 items-center"> */}
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 border-b pb-4 gap-4">
                        {/* Vendor */}
                        <select
                            value={vendor}
                            onChange={(e) =>
                                setVendor(e.target.value as Vendor)
                            }
                            className="rounded-lg border px-3 py-2"
                        >
                            <option value="flipkart">Flipkart</option>
                            <option value="meesho">Meesho</option>
                        </select>

                        {/* Meesho Layout */}
                        {vendor === "meesho" && (
                            <select
                                value={layout}
                                onChange={(e) =>
                                    setLayout(e.target.value as MeeshoLayout)
                                }
                                className="rounded-lg border px-3 py-2"
                            >
                                <option value="normal">Normal</option>
                                <option value="fast">Fast / Shadowfax</option>
                            </select>
                        )}

                        {/* Zoom + Crop Toggle */}
                        <div className="md:col-span-2">
                            <PdfControls
                                zoom={zoom}
                                setZoom={setZoom}
                                showCrop={showCrop}
                                setShowCrop={setShowCrop}
                                pageInfo={
                                    files.length
                                        ? `${files.length} PDF(s)`
                                        : "No PDFs loaded"
                                }
                            />
                        </div>

                        {/* Group by SKU */}
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={groupBySku}
                                onChange={(e) =>
                                    setGroupBySku(e.target.checked)
                                }
                            />
                            Group by SKU
                        </label>

                        {/* Crop Button */}
                        <button
                            onClick={handleCrop}
                            disabled={loading}
                            className="rounded-lg bg-blue-600 text-white px-4 py-2
                     hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Processing..." : "Crop & Download"}
                        </button>
                    </div>

                    {/* Drag & Drop Upload */}
                    <PdfDropZone onFiles={handleAddFiles} />

                    {/* Unified Viewer */}
                    {files.length > 0 && (
                        <div className="bg-slate-100 rounded-xl p-4">
                            <PdfWorkspace
                                files={files}
                                vendor={vendor}
                                layout={layout}
                                zoom={zoom}
                                showCrop={showCrop}
                            />
                        </div>
                    )}
                </div>
            </div>
    )
}
