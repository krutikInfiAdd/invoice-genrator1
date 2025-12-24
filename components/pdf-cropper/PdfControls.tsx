export default function PdfControls({
                                        zoom,
                                        setZoom,
                                        showCrop,
                                        setShowCrop,
                                        pageInfo,
                                    }: any) {
    return (
        <div className="flex gap-3 items-center bg-white p-3 rounded-xl shadow-soft">
            <button onClick={() => setZoom((z: number) => z - 0.1)}>
                −
            </button>
            <span>{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom((z: number) => z + 0.1)}>
                +
            </button>

            <div className="ml-4 text-sm text-slate-500">
                {pageInfo}
            </div>

            <label className="ml-auto flex items-center gap-2 text-sm">
                <input
                    type="checkbox"
                    checked={showCrop}
                    onChange={(e) => setShowCrop(e.target.checked)}
                />
                Show crop area
            </label>
        </div>
    )
}
