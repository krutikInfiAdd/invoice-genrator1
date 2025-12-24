import React, { useRef, useState } from "react"

export default function PdfDropZone({
                                        onFiles,
                                    }: {
    onFiles: (files: File[]) => void
}) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [dragActive, setDragActive] = useState(false)

    function openFileDialog() {
        inputRef.current?.click()
    }

    function handleFiles(fileList: FileList | null) {
        if (!fileList) return

        const pdfs = Array.from(fileList).filter(
            (f) => f.type === "application/pdf"
        )

        if (pdfs.length === 0) {
            alert("Only PDF files are allowed")
            return
        }

        onFiles(pdfs)
    }

    function onDragEnter(e: React.DragEvent) {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(true)
    }

    function onDragLeave(e: React.DragEvent) {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
    }

    function onDragOver(e: React.DragEvent) {
        e.preventDefault()
        e.stopPropagation()
    }

    function onDrop(e: React.DragEvent) {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        handleFiles(e.dataTransfer.files)
    }
// flex flex-col sm:flex-row justify-between items-center mb-6 border-b pb-4 gap-4
    return (
        <div
            onClick={openFileDialog}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
            className={`
        cursor-pointer rounded-xl border-2 border-dashed p-10 text-center 
        transition
        ${
                dragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-300 bg-slate-50 hover:bg-slate-100"
            }
      `}
        >
            <input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                multiple
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
            />

            <p className="text-base font-medium">
                Drag & drop PDF files here
            </p>
            <p className="text-sm text-slate-500 mt-1">
                or click to browse
            </p>
        </div>
    )
}
